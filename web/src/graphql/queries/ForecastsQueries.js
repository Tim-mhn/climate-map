import { gql } from '@apollo/client';


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
query AlltimeTemperatures($type: String) {
    alltime_forecasts(test: false, percentile: "50", type: $type, variable: "tas") { 
  		country, 
    	data {
            scenario
            annualVal
            monthVals
            fromYear
            toYear
            percentile
      },
      error,
  }
}`

export const AlltimePrecipitationQuery = gql`
query AlltimePrecipitations($type: String) {
    alltime_forecasts(test: false, percentile: "50", type: $type, variable: "pr") { 
  		country, 
    	data {
            scenario
            annualVal
            monthVals
            fromYear
            toYear
            percentile
      },
      error,
  }
}`