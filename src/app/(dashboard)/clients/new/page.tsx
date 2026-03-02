'use client';

import { useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

function NewClientContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [accessInfo, setAccessInfo] = useState('');
  const [keySafe, setKeySafe] = useState('');
  const [alarmCode, setAlarmCode] = useState('');
  const [pets, setPets] = useState('');
  const [preferences, setPreferences] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasNotes = !!(keySafe || alarmCode || accessInfo || pets || preferences);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const notes: Record<string, string> = {};
      if (accessInfo) notes.accessInfo = accessInfo;
      if (keySafe) notes.keySafe = keySafe;
      if (alarmCode) notes.alarmCode = alarmCode;
      if (pets) notes.pets = pets;
      if (preferences) notes.preferences = preferences;

      const client = await api.post<{ id: string }>('/clients', {
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        notes: Object.keys(notes).length ? notes : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${client.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <div>
        <Link href="/clients" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
          ← Back to clients
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Add New Client</h1>
        <p className="mt-2 text-lg text-zinc-600">Create a new client with contact and access details</p>
      </div>

      <Card className="border-2 border-zinc-200 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-zinc-900">Client Details</CardTitle>
          <CardDescription className="text-base text-zinc-600">Basic information and optional secure notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-base font-medium text-red-700" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-base font-semibold text-zinc-900">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Smith"
                  className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-zinc-900">Phone (optional)</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                  className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <p className="mt-2 text-sm text-zinc-500">Used for WhatsApp invoices and reminders</p>
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-zinc-900">Address (optional)</label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 High Street, London, SW1A 1AA"
                  rows={3}
                  className="text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border-2 px-5 py-4 text-left font-semibold transition-all',
                    hasNotes
                      ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                      : 'border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400'
                  )}
                >
                  <div>
                    <span className="text-base text-zinc-900">Secure Notes</span>
                    <p className="mt-0.5 text-sm font-normal text-zinc-600">Key safe, alarm, access info, pets</p>
                  </div>
                  {notesOpen ? (
                    <ChevronUp className="size-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="size-5 text-zinc-500" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 space-y-5 rounded-xl border-2 border-zinc-200 bg-zinc-50/50 p-5">
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <span className="text-amber-600 text-lg">🔒</span>
                    <p className="text-sm text-amber-800 font-medium">
                      Store access codes and special instructions securely
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-semibold text-zinc-900">Key Safe Code</label>
                    <Input
                      value={keySafe}
                      onChange={(e) => setKeySafe(e.target.value)}
                      placeholder="e.g. 1234"
                      className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-semibold text-zinc-900">Alarm Code</label>
                    <Input
                      value={alarmCode}
                      onChange={(e) => setAlarmCode(e.target.value)}
                      placeholder="e.g. 5678"
                      className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-semibold text-zinc-900">Access Information</label>
                    <Input
                      value={accessInfo}
                      onChange={(e) => setAccessInfo(e.target.value)}
                      placeholder="e.g. Key under the mat"
                      className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-semibold text-zinc-900">Pets</label>
                    <Input
                      value={pets}
                      onChange={(e) => setPets(e.target.value)}
                      placeholder="e.g. Friendly dog named Max"
                      className="h-12 text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-semibold text-zinc-900">Preferences</label>
                    <Textarea
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="e.g. Use eco-friendly products only"
                      rows={3}
                      className="text-base font-medium rounded-xl border-2 border-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button 
                type="submit" 
                disabled={loading}
                size="lg"
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? 'Creating…' : 'Create Client'}
              </Button>
              <Button type="button" variant="outline" size="lg" className="h-12 text-base font-semibold" asChild>
                <Link href="/clients">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewClientPage() {
  return (
    <RequireOwner>
      <NewClientContent />
    </RequireOwner>
  );
}
