import { Request, Response, NextFunction } from "express";
import { Tour } from "../../models/tourModel";
import AppError from "../../utils/appError";

export = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params);
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius: number =
    unit === "mi" ? Number(distance) / 3963.2 : Number(distance) / 6378.1;
  console.log(radius);
  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitute and longitude in the format lat,lng.",
        400
      )
    );
  }

  const tours: any = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
};
