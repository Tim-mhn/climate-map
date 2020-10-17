import { Field, Int, ObjectType, Float } from 'type-graphql';
import AverageForecast from './AverageForecast';
import PrecipitationForecast from './PrecipitationForecast';

@ObjectType()
export class CountryBaseForecast {
  @Field()
  country: string;

  @Field(() => [AverageForecast], { nullable: true})
  data: AverageForecast[];

  @Field(() => String, { nullable: true})
  error: string;

}

@ObjectType()
export class CountryPrecipitationForecast {
  @Field()
  country: string;

  @Field(() => [PrecipitationForecast], { nullable: true})
  data: PrecipitationForecast[];

  @Field(() => String, { nullable: true})
  error?: string;

}
