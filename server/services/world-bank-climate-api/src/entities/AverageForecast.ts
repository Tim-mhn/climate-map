import { Field, Int, ObjectType, Float } from 'type-graphql';

@ObjectType()
export default class AverageForecast {
  @Field()
  scenario: string;

  @Field()
  fromYear: string;

  @Field()
  toYear: string;

  @Field(() => [Float], { nullable: true})
  value: number[];

  @Field()
  percentile: number
}
