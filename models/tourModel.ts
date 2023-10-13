import { NextFunction } from "express";
import mongoose, { Model, Schema, model } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import { User } from "./userModel";

interface UserDoc {
  firstName: string;
  lastName: string;
  getFullName(): string;
}

// interface UserVirtuals {
//   fullName: string;
// }

// type UserModel = Model<UserDoc, {}, UserVirtuals>; // <-- add virtuals here...

// const schema = new Schema<UserDoc, UserModel>({ // <-- and here
//   firstName: String,
//   lastName: String,
//   getFullName() => {}
// });

// schema.virtual<UserDoc>('fullName').get(function() {
//   return this.my;
// });

interface ITour {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  imageCover: string;
  images: string;
  createdAt: Date;
  startDates: Date;
  secretTour: boolean;
  startLocation: string[];
  location: string[];
}

interface TourVirtuals {
  durationWeeks: number;
}

// type TourModel = Model<ITour, {}, TourVirtuals>;

const tourSchema = new Schema<ITour, TourVirtuals>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
    },
    maxGroupSize: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => val.toFixed(1),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    // startLocation: {
    //   type: {
    //     type: String,
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String,
    // },
    // locations: [
    //   {
    //     type: {
    //       type: String,
    //       default: "Point",
    //       emun: ["Point"],
    //     },
    //     coordinates: [Number],
    //     address: String,
    //     description: String,
    //     day: Number,
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// tourSchema.virtual("durationWeeks").get(function () {
//   return this.duration / 7;
// });

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   // console.log(this.guides);
//   const guidesPromises = this.guides.map(async (id:string) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } }); //this trỏ đến Query object
//   this.start = Date.now();
//   next();
// });

// export const Tour = model<ITour>("Tour", tourSchema);
