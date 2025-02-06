import { useEffect } from 'react';
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from "react-router-dom";
import * as Sentry from "@sentry/react";

Sentry.init({
	dsn: 'https://418144c6a1a3db01d1258234c21345fe@o4508769471758336.ingest.us.sentry.io/4508769479163904',
	beforeSend(event) {
		// Check if it is an exception, and if so, show the report dialog
		if (event.exception && event.event_id) {
			Sentry.showReportDialog({ eventId: event.event_id });
		}
		return event;
	},
	integrations: [
		Sentry.reactRouterV6BrowserTracingIntegration({
			useEffect: useEffect,
			useLocation,
			useNavigationType,
			createRoutesFromChildren,
			matchRoutes,
		}),
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration({
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
			maskAllText: false,
			maskAllInputs: false,
			blockAllMedia: false
		}),
		Sentry.feedbackAsyncIntegration({
			colorScheme: 'light',
			id: 'portfolio-fb',
			isEmailRequired: true,
			formTitle: 'Create Bug Report'
		}),
	],
	environment: "production",
	// Tracing
	tracesSampleRate: 1.9, // 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: [/^https:\/\/api\.sleylanguren\.com\//, /^https:\/\/www\.sleylanguren\.com\/api/],
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});