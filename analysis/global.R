## code for deploying to shiny.io
# library(rsconnect)
# deployApp()

#################################################################
##                          Libraries                          ##
#################################################################


library(tidyverse)
library(sf)
library(leaflet)
library(shiny)
library(shinythemes)
library(plotly)
library(shinycssloaders)
library(jsonlite)
library(leaflet.extras)

# Health board shape file
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE)


# Intermediate shapefile
scotland_deaths <- read_rds("clean_data/scotland_deaths.rds")

# Read in GeoJSON Health Boards boundaries
geojson_health_boards <-
  readLines("clean_data/geoJSONHealthBoards.json", warn = FALSE) %>%
  paste(collapse = "\n") %>%
  fromJSON(simplifyVector = FALSE)
