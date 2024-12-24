from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from supabase import create_client, Client
from django.conf import settings
import os
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
try:
    supabase: Client = create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_KEY
    )
    logger.info(f"Supabase client initialized with URL: {settings.SUPABASE_URL}")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    raise

@csrf_exempt
@require_http_methods(["GET"])
def get_dealers(request, state=None):
    try:
        logger.info(f"Fetching dealers with state filter: {state}")
        
        # Start with base query
        query = supabase.table('dealers').select('*')
        
        # Add state filter if provided
        if state and state != 'All':
            query = query.eq('state', state)
        
        # Execute query
        logger.info("Executing dealers query")
        response = query.execute()
        logger.info(f"Got {len(response.data)} dealers")
        
        # Get dealers from response
        dealers = response.data
        
        # For each dealer, get their reviews
        for dealer in dealers:
            try:
                reviews_response = supabase.table('reviews') \
                    .select('rating') \
                    .eq('dealer_id', dealer['id']) \
                    .execute()
                
                # Calculate average rating
                reviews = reviews_response.data
                if reviews:
                    avg_rating = sum(review['rating'] for review in reviews) / len(reviews)
                    dealer['avg_rating'] = round(avg_rating, 1)
                else:
                    dealer['avg_rating'] = 0
                
                dealer['review_count'] = len(reviews)
                logger.info(f"Processed reviews for dealer {dealer['id']}")
            except Exception as e:
                logger.error(f"Error processing reviews for dealer {dealer['id']}: {str(e)}")
                dealer['avg_rating'] = 0
                dealer['review_count'] = 0
        
        return JsonResponse({
            'status': 200,
            'dealers': dealers
        })
        
    except Exception as e:
        logger.error(f"Error in get_dealers view: {str(e)}")
        return JsonResponse({
            'status': 500,
            'error': str(e)
        }, status=500)
