package com.wedding.resource

import com.wedding.service.GoogleSheetsService
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.jboss.logging.Logger

@Path("/api/config")
class ConfigResource {

    private val logger = Logger.getLogger(ConfigResource::class.java)

    @Inject
    lateinit var googleSheetsService: GoogleSheetsService

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun getConfig(): Response {
        return try {
            if (!googleSheetsService.isConfigured()) {
                logger.warn("Google Sheets service not configured, returning empty config")
                return Response.ok(emptyMap<String, Map<String, String>>()).build()
            }

            val config = googleSheetsService.getConfig()
            logger.info("Retrieved ${config.size} config entries")
            Response.ok(config).build()
        } catch (e: Exception) {
            logger.error("Error fetching config", e)
            Response.serverError()
                .entity(mapOf("error" to "Failed to fetch configuration"))
                .build()
        }
    }
}
