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
library(rmapshaper)
library(plotly)
library(shinycssloaders)

##################################################################
##                        Data Wrangling                        ##
##################################################################

#data file
management <- read_csv("clean_data/management_clean.csv")

#shape file and reducing the polygons to increase render speed
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE) %>%
  ms_simplify(keep = 0.025)

scotland_covid <- read_csv("clean_data/scotland_covid.csv")

local_authorities <- unique(scotland_covid$local_authority) %>% 
  sort()

cardio_prescriptions <- read_csv("clean_data/cardio_prescriptions.csv")

