import { gql, useQuery } from '@apollo/client';


export const TemperatureQuery = gql`
query Temperatures($start: String!, $end: String!) {
    forecasts(test: false, percentile: "50", start: $start, end: $end, type: "annualavg", variable: "tas") { 
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
query Precipitations($start: String!, $end: String!) {
    forecasts(test: false, percentile: "50", start: $start, end: $end, type: "annualavg", variable: "pr") { 
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

export const AlltimeTemperatureQuery = gql`
query AlltimeTemperatures {
    alltime_forecasts(test: false, percentile: "50", type: "annualavg", variable: "tas") { 
  		country, 
    	data {
            scenario
            value
            fromYear
            toYear
            percentile
      },
      error
  }
}`

export const AlltimePrecipitationQuery = gql`
query AlltimePrecipitations {
    alltime_forecasts(test: false, percentile: "50", type: "annualavg", variable: "pr") { 
  		country, 
    	data {
            scenario
            value
            fromYear
            toYear
            percentile
      },
      error
  }
}`