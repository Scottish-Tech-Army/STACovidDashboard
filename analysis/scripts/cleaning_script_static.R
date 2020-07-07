library(tidyverse)
#to read in shapefile
library(sf)
# To simplify shapefile
library(rmapshaper)



#################################################################
##                    Healthboard shapefile                    ##
#################################################################

## Joining the shapefile to the data
# from: https://data.gov.uk/dataset/27d0fe5f-79bb-4116-aec9-a8e565ff756a/nhs-health-boards
scotland <- st_read("raw_data/SG_NHS_HealthBoards_2019/SG_NHS_HealthBoards_2019.shp") %>%
  ms_simplify() %>% 
  group_by(HBName) %>%
  summarise(geometry = sf::st_union(geometry)) %>%
  st_transform("+proj=longlat +datum=WGS84")


# save clean file
st_write(scotland, "clean_data/scotland.shp", append=FALSE)

#################################################################
##                 Intermediate zone shapefile                 ##
#################################################################

deaths <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/scotland_covid.csv"))

scot_i_zones_raw <- st_read("raw_data/SG_IntermediateZoneBdry_2011/SG_IntermediateZone_Bdry_2011.shp")
scot_i_zones <- scot_i_zones_raw %>%
  group_by(Name) %>%
  summarise(geometry = sf::st_union(geometry)) %>%
  st_transform("+proj=longlat +datum=WGS84") %>%
  ms_simplify()


joined <- scot_i_zones %>%
  left_join(deaths, by = "Name")


write_rds(joined, path = "clean_data/scotland_deaths.rds", compress = "none")


#################################################################
##                 Intermediate zone coordinates               ##
#################################################################

#!!! curently already joined to scotland_covid data 
# Just point geometry - would like to find this to polygon geom
# Converting shapfile to tibble and extracting coordinates
# 
# scotland_interm <- st_read("raw_data/SG_IntermediateZoneCent_2011/SG_IntermediateZone_Cent_2011.shp") %>% 
#   st_transform("+proj=longlat +datum=WGS84") %>% 
#   as_tibble() %>% 
#   mutate(geometry = as.character(geometry),
#          geometry = str_sub(geometry, 3, -2)) %>% 
#   separate(col = geometry, c("long", "lat"), sep = ", ") %>% 
#   mutate(lat = as.double(lat),
#          long = as.double(long))
# 
# st_write(scotland_local, "covid19_scot_map/clean_data/scotland_covid.csv")
