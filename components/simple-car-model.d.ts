import { ReactNode } from 'react';
import { Group, AnimationClip, Vector3Tuple } from 'three';

export interface ModelLoadResult {
  scene: Group;
  animations: AnimationClip[];
  actions: Record<string, any>;
  usingBackup: boolean;
}

export interface SimpleCarModelProps {
  modelPath?: string;
  color?: string;
  scale?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  onLoad?: (data: ModelLoadResult) => void;
  onError?: (error: any) => void;
}

export function SimpleCarModel(props: SimpleCarModelProps): JSX.Element; 