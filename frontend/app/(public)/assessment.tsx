import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Legacy assessment route: Redirects to the multi-stage assessment introductory screen.
 */
export default function AssessmentRedirect() {
  return <Redirect href="/(public)/assessment-intro" />;
}

