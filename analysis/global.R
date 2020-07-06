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



local_authorities <- c("Aberdeen City", 
                          "Glasgow City", 
                          "Aberdeenshire", 
                          "West Lothian",
                          "Angus",
                          "Argyll and Bute",
                          "Clackmannanshire",
                          "Dumfries and Galloway",
                          "Dundee City",
                          "Stirling",
                          "South Lanarkshire",
                          "Perth and Kinross",
                          "East Ayrshire",
                          "East Dunbartonshire",
                          "East Lothian",
                          "West Dunbartonshire",
                          "East Renfrewshire",
                          "City of Edinburgh",
                          "North Lanarkshire",
                          "Na h-Eileanan Siar",
                          "Falkirk",
                          "Fife",
                          "Highland",
                          "Inverclyde",
                          "Midlothian",
                          "Moray",
                          "North Ayrshire",
                          "Orkney Islands",
                          "Renfrewshire",
                          "Scottish Borders",
                          "Shetland Islands",      
                          "South Ayrshire")



# Health board shape file 
scotland <- st_read("clean_data/scotland.shp", quiet = TRUE)


# Intermediate shapefile

### When available 

