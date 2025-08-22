import * as React from 'react';
import { Loader2, Send, Image as ImageIcon, X, Code2, Cpu, MessageSquare, Lightbulb, Code, Palette, Zap } from 'lucide-react';

export const Icons = {
  spinner: Loader2,
  send: Send,
  image: ImageIcon,
  close: X,
  code: Code2,
  cpu: Cpu,
  message: MessageSquare,
  lightbulb: Lightbulb,
  codeSimple: Code,
  palette: Palette,
  zap: Zap,
};

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
};
