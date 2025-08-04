import React from 'react';
import { useWordWonders } from './WordWondersProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { X, Settings, Volume2, VolumeX, Clock, Heart } from 'lucide-react';
import { GameMode } from './types';

interface WordWondersCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordWondersCustomizeModal: React.FC<WordWondersCustomizeModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useWordWonders();

  if (!isOpen) return null;

  const gameModes: { key: GameMode; label: string; icon: string; description: string }[] = [
    { key: 'random', label: 'Random Adventure', icon: '🎲', description: 'Surprise me!' },
    { key: 'complete-verb', label: 'Complete the Verb', icon: '🏃', description: 'Fill in action words' },
    { key: 'make-words', label: 'Make Many Words', icon: '🔤', description: 'Create multiple words' },
    { key: 'fix-word', label: 'Fix Broken Word', icon: '🧩', description: 'Unscramble letters' },
    { key: 'word-riddle', label: 'Word Riddle', icon: '🧠', description: 'Guess from clues' },
    { key: 'guess-word', label: 'Guess the Word', icon: '📝', description: 'Complete sentences' },
    { key: 'hidden-word', label: 'Hidden Word', icon: '🕵️', description: 'Find hidden words' }
  ];

  const themes = [
    { key: 'forest', label: 'Forest', icon: '🌲', colors: 'from-green-400 to-green-600' },
    { key: 'sky', label: 'Sky', icon: '☁️', colors: 'from-blue-400 to-blue-600' },
    { key: 'candyland', label: 'Candy', icon: '🍭', colors: 'from-pink-400 to-pink-600' },
    { key: 'underwater', label: 'Ocean', icon: '🌊', colors: 'from-teal-400 to-teal-600' }
  ];

  const updateSetting = (type: string, payload: any) => {
    dispatch({ type: type as any, payload });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-2xl relative">
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-purple-700 mb-1 flex items-center">
            <Settings className="mr-2" />
            Customize Game
          </h2>
          <p className="text-gray-500 text-sm">Adjust settings to make the game your own.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Mode */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700">Game Mode</Label>
            <Select value={state.mode} onValueChange={(value) => updateSetting('SET_MODE', value as GameMode)}>
              <SelectTrigger className="bg-purple-50 border-purple-300 rounded-xl shadow-sm">
                <SelectValue placeholder="Choose mode" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-64 overflow-y-auto z-50 rounded-xl shadow-lg">
                {gameModes.map((mode) => (
                  <SelectItem key={mode.key} value={mode.key}>
                    <div className="flex items-start gap-2">
                      <span>{mode.icon}</span>
                      <div>
                        <div className="font-semibold">{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700">Theme</Label>
            <Select value={state.theme} onValueChange={(value) => updateSetting('SET_THEME', value)}>
              <SelectTrigger className="bg-purple-50 border-purple-300 rounded-xl shadow-sm">
                <SelectValue placeholder="Choose theme" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-lg">
                {themes.map((theme) => (
                  <SelectItem key={theme.key} value={theme.key}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r ${theme.colors} text-white`}>
                      <span>{theme.icon}</span>
                      <span className="font-medium">{theme.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timer */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Timer: {state.timeLeft || 60}s
            </Label>
            <Slider
              value={[state.timeLeft || 60]}
              onValueChange={([value]) => updateSetting('SET_TIME_LEFT', value)}
              min={30}
              max={300}
              step={15}
              className="w-full"
            />
          </div>

          {/* Lives */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Lives: {state.lives || 3}
            </Label>
            <Slider
              value={[state.lives || 3]}
              onValueChange={([value]) => updateSetting('SET_LIVES', value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Sound Effects */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700 flex items-center gap-1">
              {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound Effects
            </Label>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Toggle sound feedback</span>
              <Switch
                checked={state.soundEnabled}
                onCheckedChange={(checked) => updateSetting('TOGGLE_SOUND', checked)}
              />
            </div>
          </div>

          {/* Show Hints */}
          <div className="space-y-1">
            <Label className="text-md font-semibold text-purple-700">Show Hints</Label>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Enable helpful tips</span>
              <Switch
                checked={state.showHint}
                onCheckedChange={(checked) => updateSetting('SHOW_HINT', checked)}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="md:col-span-2 space-y-1">
            <Label className="text-md font-semibold text-purple-700">Difficulty</Label>
            <Select value={'medium'} onValueChange={(value) => updateSetting('SET_DIFFICULTY', value)}>
              <SelectTrigger className="bg-purple-50 border-purple-300 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 rounded-xl shadow-lg">
                <SelectItem value="easy">🟢 Easy – Simple words</SelectItem>
                <SelectItem value="medium">🟡 Medium – Balanced challenge</SelectItem>
                <SelectItem value="hard">🔴 Hard – Complex words</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Apply Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
