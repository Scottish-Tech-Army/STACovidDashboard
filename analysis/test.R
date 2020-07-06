library(tidyverse)
#to read in shapefile
library(sf)
# To simplify shapefile
library(rmapshaper)
library(leaflet)

deaths <- read_csv(url("https://sta-homebrew-iteam.s3.eu-west-2.amazonaws.com/data/analysis/scotland_covid.csv"))

scot_i_zones_raw <- st_read("raw_data/SG_IntermediateZoneBdry_2011/SG_IntermediateZone_Bdry_2011.shp")
scot_i_zones <- scot_i_zones_raw %>% 
  group_by(Name) %>%
  summarise(geometry = sf::st_union(geometry)) %>%
  st_transform("+proj=longlat +datum=WGS84") %>%
  ms_simplify()


joined <- scot_i_zones %>%
  left_join(deaths, by = "Name")

# creates bins and palette for leaflet plot
# bins <- seq(0, max(management_reactive()$total), length.out = 6)

pal <- colorBin("plasma", domain = joined$rate_per_100_000_population, bins = 5)

# creates hover over labels
labels <- sprintf(
  "<strong>%s</strong><br/>%g",
  joined$Name,
  joined$rate_per_100_000_population
) %>% lapply(htmltools::HTML)



leaflet(joined) %>%
  addPolygons(color = "#444444", weight = 1, smoothFactor = 0.5,
              opacity = 1.0, fillOpacity = 0.5,
              fillColor = ~colorQuantile(c("green", "yellow", "Red"), rate_per_100_000_population)(rate_per_100_000_population),
              highlightOptions = highlightOptions(color = "white", weight = 2,
                                                  bringToFront = TRUE),
              label = labels,
              labelOptions = labelOptions(
                style = list("font-weight" = "normal",
                             padding = "3px 8px"),
                textsize = "15px",
                direction = "auto"))



joined %>%
  leaflet() %>%
  addProviderTiles("MapBox", options = providerTileOptions(
    id = "mapbox.light",
    accessToken = Sys.getenv('MAPBOX_ACCESS_TOKEN'))) %>%
  addPolygons(
    fillColor = ~pal(rate_per_100_000_population),
    weight = 2,
    opacity = 1,
    color = "white",
    dashArray = "1",
    fillOpacity = 0.7,
    highlight = highlightOptions(
      weight = 2,
      color = "white",
      bringToFront = TRUE),
    label = labels,
    labelOptions = labelOptions(
      style = list("font-weight" = "normal",
                   padding = "3px 8px"),
      textsize = "15px",
      direction = "auto")) %>%
  addLegend(pal = pal, 
            values = ~rate_per_100_000_population, 
            opacity = 0.7, 
            title = "# deaths",
            position = "topleft")



