from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from supabase import create_client, Client
from django.conf import settings
import os

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@csrf_exempt
@require_http_methods(["GET"])
def get_dealers(request, state=None):
    try:
        # Start with base query
        query = supabase.table('dealers').select('*')
        
        # Add state filter if provided
        if state and state != 'All':
            query = query.eq('state', state)
        
        # Execute query
        response = query.execute()
        
        # Get dealers from response
        dealers = response.data
        
        # For each dealer, get their reviews
        for dealer in dealers:
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
        
        return JsonResponse({
            'status': 'success',
            'dealers': dealers
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
