import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Activity, Users, Search, Brain, Heart, TrendingUp, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Patient {
  id: string;
  name: { given: string[]; family: string; }[];
  gender: string;
  birthDate: string;
}

interface QueryResult {
  mapping: {
    detected: {
      gender: string | null;
      condition: { text: string; icd10: string; display: string; } | null;
      age: { op: string; value: number; } | null;
    };
    simulatedURL: string;
  };
  results: {
    resourceType: string;
    total?: number;
    entry: { resource: Patient; }[];
  };
}

const QUERY_SUGGESTIONS = [
  "female diabetic patients over 50",
  "male patients under 30",
  "women with hypertension",
  "patients with asthma over 40",
  "elderly male patients over 65",
  "diabetic women under 45"
];

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatPatientName(nameArray: Patient['name']): string {
  if (!nameArray || nameArray.length === 0) return 'Unknown';
  const name = nameArray[0];
  const given = name.given ? name.given.join(' ') : '';
  const family = name.family || '';
  return `${given} ${family}`.trim() || 'Unknown';
}

export default function AIFHIRDashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleQuery = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    
    try {
      // Replace with your actual backend URL
      const response = await fetch('http://127.0.0.1:8000/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const genderStats = results ? {
    male: results.results.entry?.filter(e => e.resource.gender === 'male').length || 0,
    female: results.results.entry?.filter(e => e.resource.gender === 'female').length || 0,
    total: results.results.entry?.length || 0
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI on FHIR</h1>
                <p className="text-sm text-gray-600">Healthcare Data Intelligence</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Live FHIR Server
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Search className="h-5 w-5 text-blue-600" />
                Natural Language Query
              </CardTitle>
              <CardDescription>
                Ask questions about patient data in plain English
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="e.g., 'Show me female diabetic patients over 50'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                    className="pr-12 h-12 text-lg"
                  />
                  <Button
                    onClick={() => handleQuery()}
                    disabled={loading || !query.trim()}
                    className="absolute right-1 top-1 h-10"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {showSuggestions && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUERY_SUGGESTIONS.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(suggestion);
                            handleQuery(suggestion);
                          }}
                          className="h-8 text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Query Analysis */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Brain className="h-5 w-5" />
                  Query Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">Gender</p>
                    <p className="text-lg">{results.mapping.detected.gender || 'Any'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">Condition</p>
                    <p className="text-lg">{results.mapping.detected.condition?.display || 'Any'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">Age Constraint</p>
                    <p className="text-lg">
                      {results.mapping.detected.age 
                        ? `${results.mapping.detected.age.op === 'gt' ? 'Over' : results.mapping.detected.age.op === 'lt' ? 'Under' : ''} ${results.mapping.detected.age.value}`
                        : 'Any'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {genderStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                        <p className="text-2xl font-bold text-blue-600">{genderStats.total}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-pink-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Female</p>
                        <p className="text-2xl font-bold text-pink-600">{genderStats.female}</p>
                      </div>
                      <Heart className="h-8 w-8 text-pink-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Male</p>
                        <p className="text-2xl font-bold text-blue-600">{genderStats.male}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Data Source</p>
                        <p className="text-lg font-semibold text-purple-600">Live FHIR</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Patient Data Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Patient Results
                </CardTitle>
                <CardDescription>
                  Showing {results.results.entry?.length || 0} patients from FHIR server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Birth Date</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.results.entry?.slice(0, 10).map((entry, idx) => {
                        const patient = entry.resource;
                        const age = patient.birthDate ? calculateAge(patient.birthDate) : 'Unknown';
                        
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-sm">{patient.id}</TableCell>
                            <TableCell className="font-medium">
                              {formatPatientName(patient.name)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={patient.gender === 'female' ? 'default' : 'secondary'}
                                className={patient.gender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}
                              >
                                {patient.gender}
                              </Badge>
                            </TableCell>
                            <TableCell>{patient.birthDate || 'Unknown'}</TableCell>
                            <TableCell>{age}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {results.results.entry && results.results.entry.length > 10 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Showing first 10 of {results.results.entry.length} results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome State */}
        {!results && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Search</h2>
                <p className="text-gray-600">
                  Use natural language to query FHIR patient data. Try asking about patients by age, gender, or medical conditions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
