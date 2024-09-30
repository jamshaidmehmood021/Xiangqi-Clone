'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating } from '@mui/material';

const RatingModal = ({ open, handleClose, handleRatingSubmit }:any ) => {
  const [rating, setRating] = React.useState<number | null>(null);

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Rate Your Experience</DialogTitle>
      <DialogContent>
        <Rating
          name="user-rating"
          value={rating}
          onChange={handleRatingChange}
          precision={0.5}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Skip</Button>
        <Button onClick={() => {
          handleRatingSubmit(rating);
          handleClose();
        }} disabled={rating === null}>
          Submit Rating
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingModal;
