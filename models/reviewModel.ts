import mongoose, { Model, Schema, model } from "mongoose";
import { Tour } from "./tourModel";

interface IReview extends Document {
  review: string;
  rating: string;
  createdAt: Date;
  r: any;
  tour: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

interface ReviewModel extends Model<IReview> {
  constructor: {
    calcAverageRatings(tour: mongoose.Types.ObjectId): Promise<any>;
  };
}

const reviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to a  user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId: string) {
  const stats: any = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function (this: IReview & ReviewModel) {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(
  /^findOneAnd/,
  async function (this: IReview & ReviewModel, next) {
    this.r = await this.findOne();
    next();
  }
);

reviewSchema.post(/^findOneAnd/, async function (this: IReview & ReviewModel) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

export const Review = model<IReview>("Review", reviewSchema);
