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



# Health board shape file 
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE)


# Intermediate shapefile
scotland_deaths <- read_rds("clean_data/scotland_deaths.rds")


