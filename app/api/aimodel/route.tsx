import { NextRequest, NextResponse } from "next/server";

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const PROMPT = `You are an AI Trip Planner Agent.
Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.

Only ask questions about the following details in order, and wait for the user's answer before asking the next:

1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)

Once you have collected all 5 required pieces of information (source, destination, group size, budget, and trip duration), you must immediately acknowledge the information and indicate that you are starting to generate the trip plan. Do NOT ask for travel interests or any additional information at this point.

Return a response like: "Thank you for the information! I'm now generating a tailored itinerary for your [X]-day [group size] trip from [source] to [destination] with a [budget] budget. This might take a moment. Please wait..."

Along with the response, also send which UI component to display for generative UI (for example: 'budget/groupSize/tripDuration/Final'),
where Final means the AI is generating the complete final output.

Once all 5 required pieces of information are collected (after trip duration), you MUST return:
{
  "resp": "Thank you message with trip details summary",
  "ui": "Final"
}

Do not ask for travel interests or other optional information after collecting trip duration.`;

// Helper function to generate trip plan locally if API fails
function generateLocalTripPlan(messages: any[]) {
    console.log('Generating trip plan locally');
    
    // Extract info from conversation using step-by-step logic
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const emptyBoxOptions = ['create new trip', 'inspire me where to go', 'discover hidden gems', 'adventure destinations'];
    
    // Filter out EmptyBoxState options to get actual trip details
    const tripMessages = userMessages.filter((msg: any) => 
        !emptyBoxOptions.includes(msg.content?.toLowerCase())
    );
    
    console.log('Trip messages:', tripMessages);
    console.log('All user messages:', userMessages);
    
    // Extract details based on conversation order
    const source = tripMessages[0]?.content?.trim() || 'Your Location';
    const destination = tripMessages[1]?.content?.trim() || 'Your Destination';
    
    console.log('Extracted source:', source);
    console.log('Extracted destination:', destination);
    
    // Extract duration from any message
    const conversationText = messages.map((m: any) => m.content).join(' ');
    const daysMatch = conversationText.match(/(\d+)\s*days?/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 5;
    
    // Determine budget and group from conversation
    const budget = conversationText.includes('cheap') || conversationText.includes('low') ? 'Low' :
                  conversationText.includes('luxury') || conversationText.includes('high') ? 'High' : 'Medium';
    const group = conversationText.includes('family') ? 'Family' :
                  conversationText.includes('couple') ? 'Couple' :
                  conversationText.includes('friends') ? 'Friends' : 'Solo';

    // Generate realistic trip data
    const tripPlanData = {
        trip_plan: {
            destination: destination.charAt(0).toUpperCase() + destination.slice(1),
            duration: `${days} Days`,
            origin: source.charAt(0).toUpperCase() + source.slice(1),
            budget: budget,
            group_size: group,
            hotels: [
                {
                    hotel_name: `Heritage Hotel ${destination}`,
                    hotel_address: `Central ${destination}, Near Railway Station`,
                    price_per_night: budget === 'Low' ? '₹1500 per night' : budget === 'High' ? '₹5000 per night' : '₹2500 per night',
                    hotel_image_url: "",
                    geo_coordinates: { latitude: 23.0225, longitude: 72.5714 },
                    rating: 4.2,
                    description: `A comfortable hotel in the heart of ${destination} with modern amenities`
                },
                {
                    hotel_name: `Royal Palace ${destination}`,
                    hotel_address: `Old City, ${destination}`,
                    price_per_night: budget === 'Low' ? '₹2000 per night' : budget === 'High' ? '₹6000 per night' : '₹3500 per night',
                    hotel_image_url: "",
                    geo_coordinates: { latitude: 23.0315, longitude: 72.5814 },
                    rating: 4.5,
                    description: `Traditional architecture hotel with cultural ambiance in ${destination}`
                }
            ]
        },
        itinerary: Array.from({length: days}, (_, i) => ({
            day: i + 1,
            day_plan: `Day ${i + 1}: Explore ${destination} - ${getActivityForDay(destination, i + 1)}`,
            best_time_to_visit_day: i === 0 ? "Morning to Evening" : i === days - 1 ? "Morning to Afternoon" : "Full Day",
            activities: [
                {
                    place_name: getPlaceForDay(destination, i + 1),
                    place_details: getPlaceDescription(destination, i + 1),
                    place_image_url: "",
                    geo_coordinates: { 
                        latitude: 23.0225 + (i * 0.01), 
                        longitude: 72.5714 + (i * 0.01) 
                    },
                    place_address: `${destination} City, Tourist Area ${i + 1}`,
                    ticket_pricing: budget === 'Low' ? '₹100 per person' : budget === 'High' ? '₹500 per person' : '₹250 per person',
                    time_travel_each_location: "2-3 hours",
                    best_time_to_visit: i % 2 === 0 ? "Morning" : "Evening"
                },
                {
                    place_name: getSecondPlaceForDay(destination, i + 1),
                    place_details: getSecondPlaceDescription(destination, i + 1),
                    place_image_url: "",
                    geo_coordinates: { 
                        latitude: 23.0325 + (i * 0.01), 
                        longitude: 72.5814 + (i * 0.01) 
                    },
                    place_address: `${destination} Heritage District`,
                    ticket_pricing: budget === 'Low' ? '₹150 per person' : budget === 'High' ? '₹400 per person' : '₹200 per person',
                    time_travel_each_location: "1-2 hours",
                    best_time_to_visit: i % 2 === 0 ? "Afternoon" : "Morning"
                }
            ]
        }))
    };

    return NextResponse.json({
        resp: `Your ${days}-day ${group} trip to ${destination} is ready! Check out the detailed itinerary with hotels and activities.`,
        ui: 'Final',
        trip_plan: tripPlanData.trip_plan,
        itinerary: tripPlanData.itinerary
    });
}

// Helper functions for generating realistic place names and descriptions
function getActivityForDay(destination: string, day: number): string {
    const activities = [
        "Historical Sites and Local Markets",
        "Cultural Heritage and Museums", 
        "Natural Attractions and Gardens",
        "Religious Sites and Architecture",
        "Local Cuisine and Shopping"
    ];
    return activities[(day - 1) % activities.length];
}

function getPlaceForDay(destination: string, day: number): string {
    const places = [
        `${destination} Heritage Museum`,
        `${destination} Palace Complex`,
        `${destination} Garden and Lake`,
        `${destination} Temple Circuit`,
        `${destination} Local Market`
    ];
    return places[(day - 1) % places.length];
}

function getPlaceDescription(destination: string, day: number): string {
    const descriptions = [
        `Explore the rich history and cultural heritage of ${destination} through artifacts and exhibits`,
        `Visit the magnificent palace showcasing traditional architecture and royal history`,
        `Enjoy the natural beauty and peaceful environment of ${destination}'s gardens`,
        `Experience the spiritual side of ${destination} with ancient temples and religious sites`,
        `Shop for local handicrafts and taste authentic cuisine of ${destination}`
    ];
    return descriptions[(day - 1) % descriptions.length];
}

function getSecondPlaceForDay(destination: string, day: number): string {
    const places = [
        `${destination} City Center`,
        `${destination} Art Gallery`,
        `${destination} Riverside Walk`,
        `${destination} Cultural Center`,
        `${destination} Handicraft Village`
    ];
    return places[(day - 1) % places.length];
}

function getSecondPlaceDescription(destination: string, day: number): string {
    const descriptions = [
        `Walk through the bustling city center and experience local life in ${destination}`,
        `Discover local art and contemporary culture at ${destination}'s premier gallery`,
        `Take a peaceful walk along the river and enjoy scenic views of ${destination}`,
        `Learn about local traditions and cultural practices at the cultural center`,
        `Visit local artisans and see traditional crafts being made in ${destination}`
    ];
    return descriptions[(day - 1) % descriptions.length];
}

// Helper function for conversation responses
function getConversationResponse(messages: any[]): string {
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    
    // Handle EmptyBoxState options
    if (lastUserMessage.toLowerCase() === 'create new trip') {
        return "Hello! I'm here to help you plan your next adventure. To start, where will you be traveling from?";
    } else if (lastUserMessage.toLowerCase() === 'inspire me where to go') {
        return "I'd love to inspire your next adventure! First, let me know where you'll be traveling from, and I can suggest some amazing destinations based on your preferences.";
    } else if (lastUserMessage.toLowerCase() === 'discover hidden gems') {
        return "Exciting! I can help you discover hidden gems and off-the-beaten-path destinations. To get started, where will you be traveling from?";
    } else if (lastUserMessage.toLowerCase() === 'adventure destinations') {
        return "Perfect! I'll help you find thrilling adventure destinations. First, let me know your starting location so I can suggest the best adventure spots for you.";
    }
    
    // Define all the options that should be excluded from step counting
    const emptyBoxOptions = ['create new trip', 'inspire me where to go', 'discover hidden gems', 'adventure destinations'];
    const groupSizeOptions = ['just me - 1', 'a couple - 2 people', 'family - 3 to 5 people', 'friends - 5 to 10 people'];
    const budgetOptions = ['cheap:stay conscious of costs', 'moderate:keep cost on the average side', 'luxury:don\'t worry about cost'];
    
    // Check if message is a UI selection (case insensitive)
    const isGroupSizeSelection = groupSizeOptions.includes(lastUserMessage.toLowerCase());
    const isBudgetSelection = budgetOptions.some(option => lastUserMessage.toLowerCase().includes(option.split(':')[0]));
    const isDaysSelection = /^\d+\s+days?$/i.test(lastUserMessage);
    

    
    // Count actual conversation steps (text inputs only, not UI selections)
    let conversationStep = 0;
    for (let i = 0; i < userMessages.length; i++) {
        const msg = userMessages[i]?.content?.toLowerCase() || '';
        const isEmptyBoxOption = emptyBoxOptions.includes(msg);
        const isUISelection = groupSizeOptions.includes(msg) || 
                             budgetOptions.some(option => msg.includes(option.split(':')[0])) ||
                             /^\d+\s+days?$/i.test(userMessages[i]?.content || '');
        
        if (!isEmptyBoxOption && !isUISelection) {
            conversationStep++;
        }
    }
    

    
    // Handle UI selections with appropriate responses
    if (isGroupSizeSelection) {
        return "Perfect! What is your preferred budget for this trip (Low, Medium, or High)?";
    } else if (isBudgetSelection) {
        return "Got it! Finally, how many days will your trip last?";
    } else if (isDaysSelection) {
        return "Thank you for the information! I'm now generating a tailored itinerary for your trip. This might take a moment. Please wait...";
    }
    
    // Step-by-step flow for text inputs
    if (conversationStep === 0) {
        return "Hello! I'm here to help you plan your next adventure. To start, where will you be traveling from?";
    } else if (conversationStep === 1) {
        return "Great! And what is your desired destination city or country?";
    } else if (conversationStep === 2) {
        return "Understood! Who will be traveling with you (Solo, Couple, Family, or Friends)?";
    } else {
        return "Thank you for the information! I'm now generating a tailored itinerary for your trip. This might take a moment. Please wait...";
    }
}

// Helper function to determine UI component
function determineUIComponent(messages: any[]): string | null {
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    
    // Define all the options that should be excluded from step counting
    const emptyBoxOptions = ['create new trip', 'inspire me where to go', 'discover hidden gems', 'adventure destinations'];
    const groupSizeOptions = ['just me - 1', 'a couple - 2 people', 'family - 3 to 5 people', 'friends - 5 to 10 people'];
    const budgetOptions = ['cheap:stay conscious of costs', 'moderate:keep cost on the average side', 'luxury:don\'t worry about cost'];
    
    // Check if current message is a UI selection (case insensitive)
    const isGroupSizeSelection = groupSizeOptions.includes(lastUserMessage.toLowerCase());
    const isBudgetSelection = budgetOptions.some(option => lastUserMessage.toLowerCase().includes(option.split(':')[0]));
    const isDaysSelection = /^\d+\s+days?$/i.test(lastUserMessage);
    

    
    // Count actual conversation steps (text inputs only, not UI selections)
    let conversationStep = 0;
    for (let i = 0; i < userMessages.length; i++) {
        const msg = userMessages[i]?.content?.toLowerCase() || '';
        const isEmptyBoxOption = emptyBoxOptions.includes(msg);
        const isUISelection = groupSizeOptions.includes(msg) || 
                             budgetOptions.some(option => msg.includes(option.split(':')[0])) ||
                             /^\d+\s+days?$/i.test(userMessages[i]?.content || '');
        
        if (!isEmptyBoxOption && !isUISelection) {
            conversationStep++;
        }
    }
    

    
    // Return UI component based on what was just selected or conversation step
    // Priority: UI selections first, then conversation step
    if (isGroupSizeSelection) {
        return 'budget';
    } else if (isBudgetSelection) {
        return 'tripDuration';
    } else if (isDaysSelection) {
        return 'Final';
    } else if (conversationStep === 2) {
        return 'groupSize';
    }
    
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const { messages, isFinal } = await req.json();

        // Check if Google Gemini API key is configured
        if (!GOOGLE_GEMINI_API_KEY || GOOGLE_GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
            console.log('Google Gemini API key not configured, using local generation');
            
            if (isFinal) {
                return generateLocalTripPlan(messages);
            } else {
                return NextResponse.json({
                    resp: getConversationResponse(messages),
                    ui: determineUIComponent(messages)
                });
            }
        }

        console.log('Google Gemini API - Using API key:', GOOGLE_GEMINI_API_KEY?.substring(0, 10) + '...');

        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try Google Gemini for both conversation and trip generation
        try {
            let conversationHistory;
            let systemPrompt;

            if (isFinal) {
                // For final trip generation
                const userMessages = messages.filter((m: any) => m.role === 'user');
                const emptyBoxOptions = ['create new trip', 'inspire me where to go', 'discover hidden gems', 'adventure destinations'];
                
                // Filter out EmptyBoxState options to get actual trip details
                const tripMessages = userMessages.filter((msg: any) => 
                    !emptyBoxOptions.includes(msg.content?.toLowerCase())
                );
                
                const source = tripMessages[0]?.content?.trim() || 'Source Location';
                const destination = tripMessages[1]?.content?.trim() || 'Destination';
                const conversationSummary = tripMessages.map((m: any) => m.content).join('. ');
                
                systemPrompt = `Generate a comprehensive travel plan for a trip from ${source} to ${destination}.

User's trip details: ${conversationSummary}

Create a detailed travel plan with real places, hotels, and activities for the destination mentioned. Include accurate pricing in local currency (convert to ₹ for display), real hotel names, actual tourist attractions, and practical travel information.

Return ONLY valid JSON in this exact format:
{
  "trip_plan": {
    "destination": "${destination}",
    "duration": "X Days",
    "origin": "${source}",
    "budget": "Low/Medium/High",
    "group_size": "Solo/Couple/Family/Friends",
    "hotels": [
      {
        "hotel_name": "real hotel name",
        "hotel_address": "actual address",
        "price_per_night": "₹XXXX per night",
        "hotel_image_url": "",
        "geo_coordinates": {"latitude": XX.XXXX, "longitude": XX.XXXX},
        "rating": X.X,
        "description": "hotel description"
      }
    ]
  },
  "itinerary": [
    {
      "day": 1,
      "day_plan": "day overview",
      "best_time_to_visit_day": "time recommendation",
      "activities": [
        {
          "place_name": "real attraction name",
          "place_details": "detailed description",
          "place_image_url": "",
          "geo_coordinates": {"latitude": XX.XXXX, "longitude": XX.XXXX},
          "place_address": "actual address",
          "ticket_pricing": "₹XXX per person",
          "time_travel_each_location": "time needed",
          "best_time_to_visit": "optimal time"
        }
      ]
    }
  ]
}`;

                conversationHistory = [{
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                }];
            } else {
                // For regular conversation
                systemPrompt = PROMPT;
                conversationHistory = [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    },
                    ...messages.map((msg: any) => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }))
                ];
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: conversationHistory,
                    generationConfig: {
                        temperature: isFinal ? 0.2 : 0.7,
                        maxOutputTokens: isFinal ? 4096 : 1024,
                    }
                })
            });

            if (response.ok) {
                const result = await response.json();
                const messageContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (messageContent) {
                    if (isFinal) {
                        // Parse JSON response for trip plan
                        try {
                            const cleanedResponse = messageContent
                                .replace(/```json/g, '')
                                .replace(/```/g, '')
                                .trim();
                            
                            const tripPlanData = JSON.parse(cleanedResponse);
                            
                            return NextResponse.json({
                                resp: 'Your personalized trip plan is ready! Check out the detailed itinerary with real hotels and attractions.',
                                ui: 'Final',
                                trip_plan: tripPlanData.trip_plan,
                                itinerary: tripPlanData.itinerary
                            });
                        } catch (parseError) {
                            console.log('JSON parse failed, using local generation');
                            return generateLocalTripPlan(messages);
                        }
                    } else {
                        // Regular conversation response
                        return NextResponse.json({
                            resp: messageContent,
                            ui: determineUIComponent(messages)
                        });
                    }
                }
            } else {
                console.log('Google Gemini API failed, using local fallback');
                if (isFinal) {
                    return generateLocalTripPlan(messages);
                }
            }
        } catch (error) {
            console.log('Google Gemini error, using local fallback:', error);
            if (isFinal) {
                return generateLocalTripPlan(messages);
            }
        }

        // Fallback to local conversation handling
        return NextResponse.json({
            resp: getConversationResponse(messages),
            ui: determineUIComponent(messages)
        });

    } catch (e: any) {
        console.error('API Error:', e);

        // Always provide a working response
        const { messages, isFinal } = await req.json();
        
        if (isFinal) {
            return generateLocalTripPlan(messages || []);
        } else {
            return NextResponse.json({
                resp: getConversationResponse(messages || []),
                ui: determineUIComponent(messages || [])
            });
        }
    }
}
