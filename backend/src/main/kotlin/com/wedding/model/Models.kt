package com.wedding.model

data class RSVPRequest(
    val name: String,
    val guests: Int,
    val diet: String,
    val message: String,
    val locale: String,
    val source: String
)

data class RSVPResponse(
    val status: String,
    val message: String? = null
)

data class ConfigEntry(
    val key: String,
    val zh: String,
    val en: String
)
