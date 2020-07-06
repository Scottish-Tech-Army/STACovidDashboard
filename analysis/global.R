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

management <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/dailyHealthBoardsCasesAndPatients.csv")) %>% 
  mutate(
    value = str_replace_all(value, "\\*", "0"),
    value = as.numeric(value)
    # ,
    # date = lubridate::as_date(date)
  )


#shape file and reducing the polygons to increase render speed
#scotland <- st_read("clean_data/scotland.shp", quiet = TRUE) %>%
  #ms_simplify(keep = 0.025)





