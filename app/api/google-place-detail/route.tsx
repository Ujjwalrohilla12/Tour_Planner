import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { placeName } = await req.json();
  
  if (!placeName) {
    return NextResponse.json({ error: "Place name is required" }, { status: 400 });
  }

  // Check if Google Places API key is configured
  const apiKey = process?.env?.GOOGLE_PLACE_API_KEY;
  if (!apiKey || apiKey === 'your_google_places_api_key_here') {
    console.warn("Google Places API key not configured, returning placeholder");
    return NextResponse.json({ 
      error: "Google Places API key not configured",
      url: "/placeholder.svg" 
    }, { status: 200 });
  }

  const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
    },
  };

  try {
    const result = await axios.post(
      BASE_URL,
      {
        textQuery: placeName,
      },
      config
    );

    if (!result?.data?.places || result.data.places.length === 0) {
      return NextResponse.json({ 
        error: "No places found",
        url: "/placeholder.svg" 
      }, { status: 200 });
    }

    const place = result.data.places[0];
    if (!place?.photos || place.photos.length === 0) {
      return NextResponse.json({ 
        error: "No photos found for this place",
        url: "/placeholder.svg" 
      }, { status: 200 });
    }

    const placeRefName = place.photos[0].name;
    const PhotoRefUrl = `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
    
    return NextResponse.json({ url: PhotoRefUrl });
  } catch (e: any) {
    console.error("Google Places API Error:", e);
    // Return placeholder instead of error to prevent UI breaking
    return NextResponse.json({ 
      error: e?.response?.data || e?.message || "Failed to fetch place details",
      url: "/placeholder.svg"
    }, { status: 200 });
  }
}
