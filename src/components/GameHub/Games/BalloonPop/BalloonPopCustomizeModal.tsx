import React from 'react';
import { useBalloonPopGame } from './BalloonPopGameProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { X, Settings, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface BalloonPopCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BalloonPopCustomizeModal: React.FC<BalloonPopCustomizeModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useBalloonPopGame();

  if (!isOpen) return null;

  const updateSetting = (key: string, value: any) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white p-6 shadow-2xl relative">
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-2 flex items-center">
            <Settings className="mr-2" />
            Customize Game
          </h2>
          <p className="text-gray-600">Adjust settings in real-time while playing!</p>
        </div>

        <div className="space-y-6">
          {/* Game Mode */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-purple-700">Game Mode</Label>
            <Select value={state.gameMode} onValueChange={(value) => updateSetting('gameMode', value)}>
              <SelectTrigger className="bg-white border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="learning">📚 Learning Mode</SelectItem>
                <SelectItem value="timeChallenge">⏱️ Time Challenge</SelectItem>
                <SelectItem value="endless">🏆 Endless Mode</SelectItem>
                <SelectItem value="story">🎭 Story Mode</SelectItem>
                <SelectItem value="multiplayer">👥 Multiplayer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-purple-700">Difficulty Level</Label>
            <Select value={state.difficulty} onValueChange={(value) => updateSetting('difficulty', value)}>
              <SelectTrigger className="bg-white border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="easy">🟢 Easy - Perfect for beginners</SelectItem>
                <SelectItem value="medium">🟡 Medium - Good challenge</SelectItem>
                <SelectItem value="hard">🔴 Hard - Expert level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learning Category */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-purple-700">Learning Focus</Label>
            <Select value={state.category} onValueChange={(value) => updateSetting('category', value)}>
              <SelectTrigger className="bg-white border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="letters">🔤 Letters & Alphabet</SelectItem>
                <SelectItem value="numbers">🔢 Numbers & Counting</SelectItem>
                <SelectItem value="math">➕ Math Operations</SelectItem>
                <SelectItem value="words">📖 Words & Spelling</SelectItem>
                <SelectItem value="colors">🌈 Colors & Patterns</SelectItem>
                <SelectItem value="shapes">🔷 Shapes & Geometry</SelectItem>
                <SelectItem value="animals">🐾 Animals & Nature</SelectItem>
                <SelectItem value="science">🧪 Science Facts</SelectItem>
                <SelectItem value="geography">🌍 Geography</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-purple-700">Game Theme</Label>
            <Select value={state.theme} onValueChange={(value) => updateSetting('theme', value)}>
              <SelectTrigger className="bg-white border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="jungle">🌴 Jungle Adventure</SelectItem>
                <SelectItem value="space">🚀 Space Explorer</SelectItem>
                <SelectItem value="underwater">🌊 Underwater World</SelectItem>
                <SelectItem value="rainbow">🌈 Rainbow Land</SelectItem>
                <SelectItem value="castle">🏰 Magic Castle</SelectItem>
                <SelectItem value="farm">🚜 Happy Farm</SelectItem>
                <SelectItem value="forest">🌲 Enchanted Forest</SelectItem>
                <SelectItem value="ocean">🐠 Ocean Deep</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-purple-700">Audio & Accessibility</Label>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {state.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                <Label>Sound Effects</Label>
              </div>
              <Switch
                checked={state.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {state.voiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                <Label>Voice Instructions</Label>
              </div>
              <Switch
                checked={state.voiceEnabled}
                onCheckedChange={(checked) => updateSetting('voiceEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Hints</Label>
              <Switch
                checked={state.showHints}
                onCheckedChange={(checked) => updateSetting('showHints', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Particle Effects</Label>
              <Switch
                checked={state.particles}
                onCheckedChange={(checked) => updateSetting('particles', checked)}
              />
            </div>
          </div>

          {/* Time Settings */}
          {state.gameMode === 'timeChallenge' && (
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-purple-700">Time Limit (seconds): {state.timeLimit}</Label>
              <Slider
                value={[state.timeLimit]}
                onValueChange={([value]) => updateSetting('timeLimit', value)}
                min={30}
                max={300}
                step={15}
                className="w-full"
              />
            </div>
          )}

        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-2 rounded-full font-bold"
          >
            Apply Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};