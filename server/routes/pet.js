'use strict';

const express = require('express');
const routeGuard = require('./../middleware/route-guard');
const router = express.Router();
const Pet = require('./../models/pet');
const Bookmark = require('./../models/bookmark');

// GET - '/pet/search' - Allows user to search for pets <!-- type, area(google api), sub-filters maybe related to the pet/type -->
// router.get('/search', (req, res, next) => {
//   const { type, breed, adopted, lat, lng, distance } = req.query;
//   Pet.find({
//     type,
//     breed,
//     adopted
//   })
//     // .circle('location', { center: [lng, lat], radius: distance })
//     .then((pets) => {
//       res.json({ pets });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// GET - '/pet/list' - list pets
router.get('/list', (req, res, next) => {
  Pet.find()
    .then((pets) => {
      res.json({ pets });
    })
    .catch((error) => {
      next(error);
    });
});

// load latest pets sorted and limited
router.get('/list/latest', (req, res, next) => {
  Pet.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .then((pets) => {
      res.json({ pets });
    })
    .catch((error) => {
      next(error);
    });
});

// list all bookmarks by the user
router.get('/bookmarked', routeGuard, (req, res, next) => {
  console.log('Nina');
  const userId = req.user._id;
  Bookmark.find({ user: userId })
    .populate('pet')
    .then((bookmarks) => {
      const pets = bookmarks.map((bookmark) => bookmark.pet);
      console.log(pets);
      res.json({ pets });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// GET - '/pet/:id' - Load details on a single pet
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Pet.findById(id)
    .then((pet) => {
      res.json({ pet });
    })
    .catch((error) => {
      next(error);
    });
});

// DELETE - '/pet:/id' Delete single pet
router.delete('/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Pet.findByIdAndDelete(id)
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      next(error);
    });
});

// PATCH - '/pet/:id' - Edit single pet
router.patch('/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  // which properties need to be listed here?
  const { name, type, breed, age, location, picture } = req.body;
  Pet.findByIdAndUpdate(
    id,
    { name, type, breed, age, location, picture },
    { new: true }
  )
    .then((pet) => {
      res.json({ pet });
    })
    .catch((error) => {
      next(error);
    });
});

// POST - '/pet' Creates single pet
router.post('/', routeGuard, (req, res, next) => {
  // required properties need to be listed here
  const { name, type, breed, age, listed, adopted /*, location, picture*/ } =
    req.body;
  const { owner } = req.params;
  Pet.create({
    name,
    type,
    breed,
    age,
    listed,
    adopted,
    owner /*, location, picture*/
  })
    .then((pet) => {
      res.json({ pet });
    })
    .catch((error) => {
      next(error);
    });
});

// set a bookmark
router.post('/bookmark/:id', routeGuard, (req, res, next) => {
  console.log('Ana');
  const { id } = req.params;
  const userId = req.user._id;
  Bookmark.findOne({ pet: id, user: userId })
    .then((pet) => {
      if (!pet) {
        return Bookmark.create({ pet: id, user: userId });
      }
    })
    .then((bookmark) => {
      res.json({ bookmark });
    })
    .catch((error) => {
      next(error);
    });
});

// delete a bookmark
router.delete('/:id/bookmark', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  Bookmark.findOneAndDelete({ pet: id, user: userId })
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
