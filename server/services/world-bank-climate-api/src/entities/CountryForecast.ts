import { Field, Int, ObjectType, Float } from 'type-graphql';
import AverageForecast from './AverageForecast';

@ObjectType()
export default class CountryForecast {
  @Field()
  country: string;

  @Field(() => [AverageForecast], { nullable: true})
  data: AverageForecast[];

  @Field(() => Float, { nullable: true})
  ref?: number

}
