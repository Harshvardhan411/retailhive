import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { logAction } from './logger';

export interface Shop {
  id?: string;
  shopName: string;
  ownerName: string;
  address: string;
  contact?: string;
  categoryId?: string;
  floorId?: string;
  category?: string;
  floor?: string;
  [key: string]: unknown;
}

export interface Offer {
  id?: string;
  title: string;
  description: string;
  discount: string;
  shopId: string;
  validUntil?: string;
  [key: string]: unknown;
}

export interface Review {
  id?: string;
  offerId?: string;
  shopId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  address?: string;
  mobile?: string;
  favorites?: string[];
  [key: string]: unknown;
}

export interface AnalyticsData {
  totalShops: number;
  totalOffers: number;
  totalUsers: number;
  totalReviews: number;
  averageRating: number;
  topCategories: Array<{ category: string; count: number }>;
  topFloors: Array<{ floor: string; count: number }>;
}

export interface UserActivity {
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface TrendingOffer extends Offer {
  viewCount: number;
  favoriteCount: number;
  averageRating: number;
}

export interface RecommendationScore {
  offer: Offer;
  score: number;
  reasons: string[];
}

/**
 * Adds a document to a Firestore collection.
 * @param collectionName - The Firestore collection name
 * @param data - The data to add
 * @returns The new document ID
 */
export async function addItem<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<string> {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  logAction(`Add ${collectionName.slice(0, -1)}`, data);
  return docRef.id;
}

/**
 * Gets all documents from a Firestore collection.
 * @param collectionName - The Firestore collection name
 * @returns Array of documents
 */
export async function getItems<T extends Record<string, unknown>>(collectionName: string): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  logAction(`Get ${collectionName}`, items);
  return items;
}

/**
 * Updates a document in a Firestore collection.
 * @param collectionName - The Firestore collection name
 * @param id - The document ID
 * @param data - The data to update
 */
export async function updateItem<T extends Record<string, unknown>>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
  logAction(`Update ${collectionName.slice(0, -1)}`, { id, ...data });
}

/**
 * Deletes a document from a Firestore collection.
 * @param collectionName - The Firestore collection name
 * @param id - The document ID
 */
export async function deleteItem(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  logAction(`Delete ${collectionName.slice(0, -1)}`, { id });
}

/**
 * Gets a single user document by ID.
 * @param userId - The user ID
 * @returns The user document data
 */
export async function getUserById(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } as User : null;
}

/**
 * Updates the favorites array for a user.
 * @param userId - The user ID
 * @param favorites - The new favorites array
 */
export async function updateUserFavorites(userId: string, favorites: string[]): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { favorites });
  logAction('Update user favorites', { userId, favorites });
}

/**
 * Adds a review to a Firestore collection (shopReviews or offerReviews).
 * @param collectionName - The Firestore collection name
 * @param data - The review data
 * @returns The new review document ID
 */
export async function addReview<T extends Review>(collectionName: string, data: T): Promise<string> {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  logAction(`Add review to ${collectionName}`, data);
  return docRef.id;
}

/**
 * Gets all reviews for a given item (shopId or offerId) from a collection.
 * @param collectionName - The Firestore collection name
 * @param itemIdField - The field name (shopId or offerId)
 * @param itemId - The ID of the shop or offer
 * @returns Array of reviews
 */
export async function getReviews<T extends Review>(collectionName: string, itemIdField: string, itemId: string): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    .filter((review: T) => (review as Record<string, unknown>)[itemIdField] === itemId);
  logAction(`Get reviews from ${collectionName} for ${itemId}`, reviews);
  return reviews;
}

/**
 * Updates a review document in a collection.
 * @param collectionName - The Firestore collection name
 * @param reviewId - The review document ID
 * @param data - The data to update
 */
export async function updateReview<T extends Review>(collectionName: string, reviewId: string, data: Partial<T>): Promise<void> {
  const docRef = doc(db, collectionName, reviewId);
  await updateDoc(docRef, data);
  logAction(`Update review in ${collectionName}`, { reviewId, ...data });
}

/**
 * Deletes a review document from a collection.
 * @param collectionName - The Firestore collection name
 * @param reviewId - The review document ID
 */
export async function deleteReview(collectionName: string, reviewId: string): Promise<void> {
  const docRef = doc(db, collectionName, reviewId);
  await deleteDoc(docRef);
  logAction(`Delete review from ${collectionName}`, { reviewId });
}

/**
 * Gets personalized recommendations for a user based on their favorites and ratings
 * @param userId - The user ID
 * @param limit - Maximum number of recommendations to return
 * @returns Array of recommended offers
 */
export async function getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<RecommendationScore[]> {
  try {
    // Get user's favorites and ratings
    const userDoc = await getUserById(userId);
    const userFavorites = userDoc?.favorites || [];
    const userRatings = await getReviews('offerReviews', 'userId', userId);
    
    // Get all offers and their reviews
    const allOffers = await getItems<Offer>('offers');
    const allOfferReviews = await getReviews('offerReviews', 'rating', '');
    
    // Calculate recommendation scores
    const recommendations = allOffers.map(offer => {
      let score = 0;
      const reasons: string[] = [];
      
      // Boost if user has favorited similar offers
      if (userFavorites.includes(offer.id || '')) {
        score += 5;
        reasons.push('User favorited this offer');
      }
      
      // Boost based on user's rating preferences
      const userRating = userRatings.find(r => r.offerId === offer.id);
      if (userRating && userRating.rating >= 4) {
        score += 3;
        reasons.push('User rated similar offers highly');
      }
      
      // Boost based on overall popularity
      const offerReviews = allOfferReviews.filter(r => r.offerId === offer.id);
      const avgRating = offerReviews.length > 0 
        ? offerReviews.reduce((sum, r) => sum + r.rating, 0) / offerReviews.length 
        : 0;
      
      if (avgRating >= 4) {
        score += 2;
        reasons.push('High average rating');
      }
      
      if (offerReviews.length >= 10) {
        score += 1;
        reasons.push('Popular offer');
      }
      
      return {
        offer,
        score,
        reasons
      };
    });
    
    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
}

/**
 * Gets trending offers based on views, favorites, and ratings
 * @param limit - Maximum number of trending offers to return
 * @returns Array of trending offers
 */
export async function getTrendingOffers(limit: number = 10): Promise<TrendingOffer[]> {
  try {
    const offers = await getItems<Offer>('offers');
    const reviews = await getReviews('offerReviews', 'rating', '');
    
    const trendingOffers = offers.map(offer => {
      const offerReviews = reviews.filter(r => r.offerId === offer.id);
      const averageRating = offerReviews.length > 0 
        ? offerReviews.reduce((sum, r) => sum + r.rating, 0) / offerReviews.length 
        : 0;
      
      return {
        ...offer,
        viewCount: Math.floor(Math.random() * 1000), // Mock data - replace with actual view tracking
        favoriteCount: Math.floor(Math.random() * 100), // Mock data - replace with actual favorite tracking
        averageRating
      };
    });
    
    // Sort by a combination of factors
    return trendingOffers
      .sort((a, b) => {
        const scoreA = (a.viewCount * 0.3) + (a.favoriteCount * 0.4) + (a.averageRating * 0.3);
        const scoreB = (b.viewCount * 0.3) + (b.favoriteCount * 0.4) + (b.averageRating * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting trending offers:', error);
    return [];
  }
}

/**
 * Gets analytics data for the admin dashboard
 * @returns Analytics data object
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const shops = await getItems<Shop>('shops');
    const offers = await getItems<Offer>('offers');
    const users = await getItems<User>('users');
    const reviews = await getReviews('offerReviews', 'rating', '');
    
    // Calculate category and floor statistics
    const categoryCounts: Record<string, number> = {};
    const floorCounts: Record<string, number> = {};
    
    shops.forEach(shop => {
      if (shop.category) {
        categoryCounts[shop.category] = (categoryCounts[shop.category] || 0) + 1;
      }
      if (shop.floor) {
        floorCounts[shop.floor] = (floorCounts[shop.floor] || 0) + 1;
      }
    });
    
    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const topFloors = Object.entries(floorCounts)
      .map(([floor, count]) => ({ floor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    return {
      totalShops: shops.length,
      totalOffers: offers.length,
      totalUsers: users.length,
      totalReviews: reviews.length,
      averageRating,
      topCategories,
      topFloors
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return {
      totalShops: 0,
      totalOffers: 0,
      totalUsers: 0,
      totalReviews: 0,
      averageRating: 0,
      topCategories: [],
      topFloors: []
    };
  }
}

/**
 * Gets user activity data for admin monitoring
 * @returns Array of user activities
 */
export async function getUserActivityData(): Promise<UserActivity[]> {
  try {
    // This would typically come from a user_activities collection
    // For now, we'll return mock data
    const mockActivities: UserActivity[] = [
      {
        userId: 'user1',
        userName: 'John Doe',
        action: 'viewed_offer',
        timestamp: new Date().toISOString(),
        details: { offerId: 'offer1', offerTitle: 'Summer Sale' }
      },
      {
        userId: 'user2',
        userName: 'Jane Smith',
        action: 'added_favorite',
        timestamp: new Date().toISOString(),
        details: { shopId: 'shop1', shopName: 'Fashion Store' }
      }
    ];
    
    return mockActivities;
  } catch (error) {
    console.error('Error getting user activity data:', error);
    return [];
  }
}

/**
 * Archives expired offers by moving them to an archived collection
 * @returns Number of offers archived
 */
export async function archiveExpiredOffers(): Promise<number> {
  try {
    const offers = await getItems<Offer>('offers');
    const now = new Date();
    const expiredOffers = offers.filter(offer => {
      if (!offer.validUntil) return false;
      return new Date(offer.validUntil) < now;
    });
    
    let archivedCount = 0;
    for (const offer of expiredOffers) {
      try {
        // Add to archived collection
        await addItem('archivedOffers', offer);
        // Delete from active offers
        if (offer.id) {
          await deleteItem('offers', offer.id);
          archivedCount++;
        }
      } catch (error) {
        console.error(`Error archiving offer ${offer.id}:`, error);
      }
    }
    
    logAction('Archive expired offers', { archivedCount });
    return archivedCount;
  } catch (error) {
    console.error('Error archiving expired offers:', error);
    return 0;
  }
}

/**
 * Gets all active (non-expired) offers
 * @returns Array of active offers
 */
export async function getActiveOffers(): Promise<Offer[]> {
  try {
    const offers = await getItems<Offer>('offers');
    const now = new Date();
    
    return offers.filter(offer => {
      if (!offer.validUntil) return true; // No expiry date means always active
      return new Date(offer.validUntil) >= now;
    });
  } catch (error) {
    console.error('Error getting active offers:', error);
    return [];
  }
}

/**
 * Gets all expired offers
 * @returns Array of expired offers
 */
export async function getExpiredOffers(): Promise<Offer[]> {
  try {
    const offers = await getItems<Offer>('offers');
    const now = new Date();
    
    return offers.filter(offer => {
      if (!offer.validUntil) return false; // No expiry date means always active
      return new Date(offer.validUntil) < now;
    });
  } catch (error) {
    console.error('Error getting expired offers:', error);
    return [];
  }
}

/**
 * Extends the validity of an offer
 * @param offerId - The offer ID
 * @param newExpiryDate - The new expiry date
 */
export async function extendOfferValidity(offerId: string, newExpiryDate: string): Promise<void> {
  try {
    await updateItem('offers', offerId, { validUntil: newExpiryDate });
    logAction('Extend offer validity', { offerId, newExpiryDate });
  } catch (error) {
    console.error('Error extending offer validity:', error);
    throw error;
  }
} 