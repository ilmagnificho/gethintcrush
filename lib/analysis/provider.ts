export type PublicProfile = {
  captions: string[];
  hashtags: string[];
  timestamps?: string[];
};

export interface ContentProvider {
  fetchPublicProfile(url: string): Promise<PublicProfile>;
}

export class MockProvider implements ContentProvider {
  async fetchPublicProfile(): Promise<PublicProfile> {
    return {
      captions: [
        'Sunset run along the river #fitness #daily',
        'Trying a new ramen spot downtown #food #citylife',
        'Weekend gallery visit #art #culture'
      ],
      hashtags: ['fitness', 'daily', 'food', 'citylife', 'art', 'culture'],
      timestamps: [
        new Date().toISOString(),
        new Date(Date.now() - 86_400_000).toISOString(),
        new Date(Date.now() - 3 * 86_400_000).toISOString()
      ]
    };
  }
}

export class ManualInputProvider implements ContentProvider {
  constructor(private manualText: string) {}

  async fetchPublicProfile(): Promise<PublicProfile> {
    const lines = this.manualText.split(/\n|\r/).map((line) => line.trim()).filter(Boolean);
    return {
      captions: lines,
      hashtags: lines
        .flatMap((line) => Array.from(line.matchAll(/#(\w+)/g)).map((match) => match[1].toLowerCase()))
    };
  }
}
