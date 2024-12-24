from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from supabase import create_client
from django.conf import settings

# Initialize Supabase client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@csrf_exempt
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
            'status': 200,
            'dealers': dealers
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 500,
            'error': str(e)
        })
