import { Field, Int, ObjectType, Float } from 'type-graphql';

@ObjectType()
export default class AnnualAverageForecast {
  @Field()
  scenario: string;

  @Field()
  fromYear: string;

  @Field()
  toYear: string;


  @Field(() => [Float])
  annualVal: number[];


  @Field()
  percentile: number
}
