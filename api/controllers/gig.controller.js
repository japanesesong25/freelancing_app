import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getMyGigs =  async(req, res, next) => {
  try {
    const gig = await Gig.find({userId: req.query.userId});
    res.json(gig);
  } catch (err) {
    next(err);
  }
}

export const getGigs = async (req, res, next) => { 

  const { search, min, max } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: new RegExp(search, 'i') } },
      { features: { $in: search.split(',') } },
      { cat: { $regex: new RegExp(search, 'i') } }
    ];
  }

  if (min || max) {
    query.price = {};

    if (min) {
      query.price.$gte = parseFloat(min);
    }

    if (max) {
      query.price.$lte = parseFloat(max);
    }
  }

  try {
    const gig = await Gig.find(query);
    res.json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }



  // const filters = {
  //   ...(q.userId && { userId: q.userId }),
  //   ...(q.cat && { cat: q.cat }),
  //   ...((q.min || q.max) && {
  //     price: {
  //       ...(q.min && { $gt: q.min }),
  //       ...(q.max && { $lt: q.max }),
  //     },
  //   }),
  //   ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  //   //...(q.search && {features: q.search})
  // };

  // try {
  //   const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
  //   res.status(200).send(gigs);
  // } catch (err) {
  //   console.log(err)
  //   next(err);
  // }
};

export const getHomePageGigs = async(req, res, next) => {
  
  try {
    const gigs = await Gig.find().limit(10)
    res.status(200).send(gigs);
  } catch (err) {
    console.log(err)
    next(err);
  }

}
