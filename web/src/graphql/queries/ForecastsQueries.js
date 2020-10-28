import { gql, useQuery } from '@apollo/client';


export const TemperatureQuery = gql`
query Temperatures($start: String!, $end: String!) {
    forecasts(test: true, percentile: "50", start: $start, end: $end, type: "annualavg", variable: "tas") { 
  		country, 
    	data {
            scenario
            value
            fromYear
            toYear
            percentile
      }
  }
}`

export const PrecipitationQuery = gql`
query Temperatures($start: String!, $end: String!) {
    forecasts(test: true, percentile: "50", start: $start, end: $end, type: "annualavg", variable: "pr") { 
  		country, 
    	data {
            scenario
            value
            fromYear
            toYear
            percentile
      }
  }
}`