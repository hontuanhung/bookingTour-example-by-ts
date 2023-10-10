import { Schema, model } from "mongoose";

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
  //   guides: Schema;
}

const tourSchema = new Schema<ITour>({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A tour name must have less or equal then 40 characters"],
    minlength: [10, "A tour name must have more or euqal then 10 characters"],
    // validate: [validator.isAlpha, 'Tour name must only contain characters'],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    require: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    require: [true, "A tour must have a difficulty"],
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
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (this: ITour, val: number) {
        return val < this.price; // this only points to current doc on NEW document creation
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    require: [true, "A  tour must have a cover image"],
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
    require: true,
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  startLocation: {
    //GeoJSON
    type: {
      type: String,
      // default: 'Point',
      // emun: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: "Point",
        emun: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  ],
  //   guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

export const Tour = model<ITour>("Tour", tourSchema);
