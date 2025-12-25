package com.wedding.service

import com.google.api.client.auth.oauth2.Credential
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.client.util.store.FileDataStoreFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.api.services.sheets.v4.model.ValueRange
import com.wedding.model.ConfigEntry
import com.wedding.model.RSVPRequest
import jakarta.annotation.PostConstruct
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.jboss.logging.Logger
import java.io.File
import java.io.FileInputStream
import java.io.InputStreamReader
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@ApplicationScoped
class GoogleSheetsService {

    private val logger = Logger.getLogger(GoogleSheetsService::class.java)
    private val jsonFactory = GsonFactory.getDefaultInstance()
    private val scopes = listOf(SheetsScopes.SPREADSHEETS)

    @ConfigProperty(name = "google.sheets.spreadsheet-id")
    lateinit var spreadsheetId: String

    @ConfigProperty(name = "google.sheets.config-sheet")
    lateinit var configSheet: String

    @ConfigProperty(name = "google.sheets.rsvp-sheet")
    lateinit var rsvpSheet: String

    @ConfigProperty(name = "google.sheets.credentials-path")
    lateinit var credentialsPath: String

    private lateinit var sheetsService: Sheets

    @PostConstruct
    fun init() {
        try {
            if (spreadsheetId.isBlank()) {
                logger.warn("Google Sheets spreadsheet ID not configured. Service will not be available.")
                return
            }

            val httpTransport = GoogleNetHttpTransport.newTrustedTransport()
            val credential = getCredentials()

            sheetsService = Sheets.Builder(httpTransport, jsonFactory, credential)
                .setApplicationName("Wedding Page Backend")
                .build()

            logger.info("Google Sheets service initialized successfully")
        } catch (e: Exception) {
            logger.error("Failed to initialize Google Sheets service", e)
        }
    }

    private fun getCredentials(): Credential {
        val credFile = File(credentialsPath)
        if (!credFile.exists()) {
            throw IllegalStateException("Credentials file not found: $credentialsPath")
        }

        val clientSecrets = GoogleClientSecrets.load(
            jsonFactory,
            InputStreamReader(FileInputStream(credFile))
        )

        val flow = GoogleAuthorizationCodeFlow.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            jsonFactory,
            clientSecrets,
            scopes
        )
            .setDataStoreFactory(FileDataStoreFactory(File("tokens")))
            .setAccessType("offline")
            .build()

        val receiver = LocalServerReceiver.Builder().setPort(8888).build()
        return AuthorizationCodeInstalledApp(flow, receiver).authorize("user")
    }

    fun getConfig(): Map<String, Map<String, String>> {
        try {
            val range = "$configSheet!A:C"
            val response = sheetsService.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute()

            val values = response.getValues() ?: return emptyMap()

            return values.drop(1) // Skip header row
                .filter { it.size >= 3 }
                .associate { row ->
                    val key = row[0].toString()
                    val config = mapOf(
                        "zh" to row[1].toString(),
                        "en" to row[2].toString()
                    )
                    key to config
                }
        } catch (e: Exception) {
            logger.error("Error fetching config from Google Sheets", e)
            throw e
        }
    }

    fun saveRSVP(request: RSVPRequest): Boolean {
        try {
            val timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

            val values = listOf(
                listOf(
                    timestamp,
                    request.name,
                    request.guests.toString(),
                    request.diet,
                    request.message,
                    request.locale,
                    request.source
                )
            )

            val body = ValueRange().setValues(values)
            val range = "$rsvpSheet!A:G"

            sheetsService.spreadsheets().values()
                .append(spreadsheetId, range, body)
                .setValueInputOption("RAW")
                .execute()

            logger.info("RSVP saved successfully for: ${request.name}")
            return true
        } catch (e: Exception) {
            logger.error("Error saving RSVP to Google Sheets", e)
            throw e
        }
    }

    fun isConfigured(): Boolean {
        return spreadsheetId.isNotBlank() && ::sheetsService.isInitialized
    }
}
