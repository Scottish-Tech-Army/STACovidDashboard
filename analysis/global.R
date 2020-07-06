## code for deploying to shiny.io
# library(rsconnect)
# deployApp("covid19_scot_map/")

#################################################################
##                          Libraries                          ##
#################################################################


library(tidyverse)
library(sf)
library(leaflet)
library(shiny)
library(shinydashboard)
library(shinythemes)
library(plotly)
library(shinycssloaders)



# Health board shape file 
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE)


# Intermediate shapefile

### When available 

