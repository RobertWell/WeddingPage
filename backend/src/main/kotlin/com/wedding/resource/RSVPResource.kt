package com.wedding.resource

import com.wedding.model.RSVPRequest
import com.wedding.model.RSVPResponse
import com.wedding.service.GoogleSheetsService
import jakarta.inject.Inject
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.jboss.logging.Logger

@Path("/api/rsvp")
class RSVPResource {

    private val logger = Logger.getLogger(RSVPResource::class.java)

    @Inject
    lateinit var googleSheetsService: GoogleSheetsService

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun submitRSVP(request: RSVPRequest): Response {
        return try {
            // Validation
            if (request.name.isBlank()) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(RSVPResponse("error", "Name is required"))
                    .build()
            }

            if (request.guests <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(RSVPResponse("error", "Invalid number of guests"))
                    .build()
            }

            if (!googleSheetsService.isConfigured()) {
                logger.warn("Google Sheets service not configured, simulating success")
                logger.info("Would save RSVP: ${request.name} - ${request.guests} guests")
                return Response.ok(RSVPResponse("success", "RSVP received (demo mode)")).build()
            }

            // Save to Google Sheets
            googleSheetsService.saveRSVP(request)

            logger.info("RSVP submitted successfully by: ${request.name}")
            Response.ok(RSVPResponse("success", "Thank you for your RSVP!")).build()
        } catch (e: Exception) {
            logger.error("Error processing RSVP", e)
            Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(RSVPResponse("error", "Failed to process RSVP. Please try again later."))
                .build()
        }
    }
}
