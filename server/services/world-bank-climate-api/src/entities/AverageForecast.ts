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
  monthVals: number[];

  @Field(() => [Float], { nullable: true})
  annualVal: number[];

  @Field()
  percentile: number

  @Field(() => String, { nullable: true})
  error: string;

}
