import { createAsyncThunk } from '@reduxjs/toolkit';

import { ActionCreator, APIEndpoint } from '../../constants';
import api from '../api';

import type { GuitarWithReviews } from '../../types/guitar';
import type { GuitarReview, ReviewPost } from '../../types/review';

export const fetchProductById = createAsyncThunk<GuitarWithReviews, number>(
  ActionCreator.FetchProductById,
  async (productId) => {
    const { data } = await api.get<GuitarWithReviews>(
      `${APIEndpoint.Guitars}/${productId}?_embed=${APIEndpoint.Reviews}`,
    );

    return data;
  },
);

export const postReview = createAsyncThunk<GuitarReview, ReviewPost>(
  ActionCreator.PostReview,
  async (review) => {
    const { data } = await api.post<GuitarReview>(`/${APIEndpoint.Reviews}`, { ...review });

    return data;
  },
);