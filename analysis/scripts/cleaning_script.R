library(tidyverse)
library(janitor)
library(lubridate)
library(sf)
library(rmapshaper)


## ----------------------------------------------------------------
##                          Covid Management                     --
## ----------------------------------------------------------------

## Most or all of this to be done when pulling data


# management <- read_csv("covid19_scot_map/raw_data/covid19_management.csv") %>%
#   clean_names()
# 
# management_clean <- management %>%
#   filter(
#     variable %in% c("Testing - Cumulative people tested for COVID-19 - Positive",
#                     "COVID-19 patients in hospital - Confirmed",
#                     "COVID-19 patients in hospital - Suspected",
#                     "COVID-19 patients in ICU - Total"
#                     ),
#     official_name != "Scotland"
#   ) %>%
#   select(-c(
#     feature_code,
#     measurement,
#     units
#   )) %>%
#   mutate(
#     value = str_replace_all(value, "\\*", "0"),
#     value = as.numeric(value),
#     date_code = as_date(date_code)
#   )
# 
# # save clean file
# write_csv(management_clean, "covid19_scot_map/clean_data/management_clean.csv")


## ----------------------------------------------------------------
##                    Intermediate Zone Data                     --
## ----------------------------------------------------------------

 # need to join in server
 # left_join(covid, by = c("Name" = "name_of_intermediate_zone"))

## ----------------------------------------------------------------
##                    Cardiovascular Medication                  --
## ----------------------------------------------------------------

# Creating local authorities to match datasets 
local_authorities <- unique(scotland_covid$local_authority)

cardio_prescriptions <- read_csv("covid19_scot_map/raw_data/cardio_extract.csv") %>% 
  mutate(week_ending = str_replace(week_ending, "Jan", "01"),
         week_ending = str_replace(week_ending, "Feb", "02"),
         week_ending = str_replace(week_ending, "Mar", "03"),
         week_ending = str_replace(week_ending, "Apr", "04"),
         week_ending = str_replace(week_ending, "May", "05"),
         week_ending = str_replace(week_ending, "Jun", "06"),
         week_ending = str_replace_all(week_ending, " ", "-"),
         area_name = str_replace_all(area_name, "&", "and"),
         area_name = str_replace_all(area_name, "NHS ", ""),
         area_name = str_replace(area_name, "Edinburgh", "City of Edinburgh"),
         area_name = str_replace(area_name, "Western Isles", "Na h-Eileanan Siar"),
         week_ending = dmy(week_ending)) 
# Splitting Clackmannanshire and Stirling
stirling <- cardio_prescriptions %>% 
  filter(area_name == "Clackmannanshire and Stirling") %>% 
  mutate(area_name = str_replace(area_name, "Clackmannanshire and Stirling", "Stirling"))
  
cardio_prescriptions <- cardio_prescriptions %>%
  rbind(stirling) %>% 
  mutate(area_name = str_replace(area_name, "Clackmannanshire and Stirling", "Clackmannanshire")) %>% 
  filter(area_name %in% local_authorities)

# save clean file
write_csv(cardio_prescriptions, "covid19_scot_map/clean_data/cardio_prescriptions.csv")

