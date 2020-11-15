import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CountryHistory {
  @Field()
  country: string;

  @Field(() => [YearValue], { nullable: true})
  data?: YearData[];

  @Field(() => String, { nullable: true})
  error?: string;


}

@ObjectType()
export class YearData {
    @Field()
    year: number

    @Field()
    data: number
}

@ObjectType()
export class YearValue {
    @Field()
    year: number

    @Field()
    value: number
}