import { Field, Int, ObjectType, Float } from 'type-graphql';
import AnnualAverageForecast from './AnnualAverageForecast';

@ObjectType()
export default class CountryForecast {
  @Field()
  country: string;

  @Field(() => [AnnualAverageForecast], { nullable: true})
  value: AnnualAverageForecast[];

}
