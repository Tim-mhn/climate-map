import { gql } from '@apollo/client';


export const TemperatureHistoryQuery = gql`
query TemperatureHistory($iso3: String!) {
    history(iso3: $iso3, variable: "tas") { 
  		country, 
    	data {
            year
            value
        }
        error
  }
}`

export const PrecipitationHistoryQuery = gql`
query PrecipitationHistory($iso3: String!) {
    history(iso3: $iso3, variable: "pr") { 
  		country, 
    	data {
            year
            value
        }
        error
  }
}`