import { Field, Int, ObjectType, Float } from 'type-graphql';

@ObjectType()
export default class PrecipitationForecast {
  @Field( { nullable: true})
  scenario: string;

  @Field()
  fromYear: string;

  @Field()
  toYear: string;

  @Field(() => [Float], { nullable: true})
  avg: number[];

  @Field(() => [Float], { nullable: true})
  anom: number[];

  @Field( { nullable: true})
  percentile: number

  @Field(() => String, { nullable: true})
  error?: string;

}
