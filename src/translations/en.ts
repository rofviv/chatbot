export default {
    hello: "Hello",
    menu: "Menu",
    location_flow: {
        no_coverage: "We regret to inform you that we do not have coverage in your location"
    },
    status: {
        pending: "pending 🕒",
        assigned: "go to the store 🏍️",
        arrived: "waiting for your order 🍛",
        dispatched: "on the way to your location 🏠",
        complete: "completed ✅",
        canceled: "canceled ❌"
    },
    register: {
        register_welcome: "Hello! Welcome, you are new here, do you want to register? It will only take you 1 minute. Yes/No",
        success: "Thank you for registering",
        error: "There was an error registering, please try again later or contact support",
        register_posponed: "No problem, we will do it later",
        register_fallback: "Please respond with Yes or No",
        register_accept: "Perfect, I will proceed to ask you some questions",
        register_name: "First, what is your name?",
        register_email: "Now, what is your email?",
        register_email_invalid: "The email is not valid, please try again",
        register_email_exists: "The email already exists, please try with another",
        register_saving: "Saving data, please wait..."
    },
    address: {
        address_first: "Before placing your order, I need to know your location",
        address_share: "Please, share your location GPS (normal location not real time)",
        address_fallback: "Please, respond with Yes or No"
    },
    location: {
        location_no_merchants: "No merchants available at the moment, try again later",
        location_no_coverage: "We regret to inform you that we do not have coverage in your location",
        location_out_coverage: "We regret to inform you that we do not have coverage in your location",
        location_coverage: "Excellent, we have coverage in your area, what do you want to order?"
    }
};
