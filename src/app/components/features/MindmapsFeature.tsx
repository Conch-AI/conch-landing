"use client";

import Footer from "@/app/components/ui/Footer";
import { CheckerFeature } from "./CheckerSidebar";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import {
  addEdge,
  Background,
  BaseEdge,
  getBezierPath,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type Connection,
  type BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Type definitions matching backend classes
const POSITION_SCALE = 280; // scale logical coordinates from API into canvas space

export class MindmapNode {
  constructor(
    public label: string,
    public definition: string,
    public positionX: number,
    public positionY: number,
    public id: string,
    public isHighlyImportant: boolean = false,
  ) {}

  static fromJSON(json: Record<string, unknown>): MindmapNode {
    // Backend may return numbers/booleans as strings – normalise here
    const rawX = json.positionX as string | number | undefined;
    const rawY = json.positionY as string | number | undefined;
    const rawImportant = json.isHighlyImportant as string | boolean | undefined;

    const positionX =
      typeof rawX === "number" ? rawX : rawX !== undefined ? parseFloat(rawX) : 0;
    const positionY =
      typeof rawY === "number" ? rawY : rawY !== undefined ? parseFloat(rawY) : 0;

    const isHighlyImportant =
      typeof rawImportant === "boolean"
        ? rawImportant
        : rawImportant === "true";

    return new MindmapNode(
      json.label as string,
      json.definition as string,
      positionX * POSITION_SCALE,
      positionY * POSITION_SCALE,
      json.id as string,
      "isHighlyImportant" in json ? isHighlyImportant : false,
    );
  }
}

export class MindmapEdge {
  constructor(
    public source: string,
    public target: string,
    public id: string,
  ) {}

  static fromJSON(json: Record<string, unknown>): MindmapEdge {
    return new MindmapEdge(
      json.source as string,
      json.target as string,
      json.id as string,
    );
  }
}

// ReactFlow type definitions
interface CustomNodeData extends Record<string, unknown> {
  label: string;
  definition: string;
  isHighlyImportant?: boolean;
}

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

interface CustomNodeProps {
  data: CustomNodeData;
  id: string;
}
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clipboard as ClipboardIcon,
  Download,
  FileText,
  GitBranch,
  GraduationCap,
  Lightbulb,
  MousePointer2,
  Network,
  Maximize2,
  X,
  Palette,
  PenLine,
  RefreshCw,
  Upload
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { RiStarSFill } from "react-icons/ri";
import SignupModal from "../SignupModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Custom Edge Component
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }: CustomEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  return <BaseEdge className="opacity-50" id={id} path={edgePath} />;
};

// Custom Node Component
const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="max-w-[300px]">
      <Handle
        type="target"
        style={{
          background: "purple",
          border: "0px",
          opacity: 0,
        }}
        position={Position.Top}
      />
      <div className="mx-auto w-10/12 text-center text-[13px] text-foreground">
        {data.definition}
      </div>
      <div className="relative mx-auto mt-2 w-fit rounded-md bg-[#8b5cf6] p-1 px-3 text-center text-[11px] text-white">
        {data.label}
        {data.isHighlyImportant && (
          <span className="absolute top-[-5px] right-[-5px] rounded-full border border-purple-300 bg-[#8b5cf6] p-[2px]">
            <RiStarSFill color="white" size={10} />
          </span>
        )}
      </div>
      <Handle
        type="source"
        style={{
          opacity: 0,
        }}
        position={Position.Bottom}
      />
    </div>
  );
};

// Main Mindmap Canvas Component
const MindmapCanvas = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node<CustomNodeData>[];
  initialEdges: Edge[];
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ customedge: CustomEdge }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      className="bg-background"
    >
      <Background
        className="opacity-40"
        variant={"cross" as BackgroundVariant}
        gap={12}
        color="currentColor"
        size={1}
      />
    </ReactFlow>
  );
};

interface MindmapsFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
}

const MindmapsFeature = ({ onFeatureSelect }: MindmapsFeatureProps = {}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mindmapNodes, setMindmapNodes] = useState<Node<CustomNodeData>[]>([]);
  const [mindmapEdges, setMindmapEdges] = useState<Edge[]>([]);

  const sampleTexts = [
    "Machine learning is a subset of artificial intelligence that enables computers to learn from data. It includes supervised learning, unsupervised learning, and reinforcement learning approaches.",
    "The water cycle describes how water moves through Earth's systems. It includes evaporation from oceans, condensation in clouds, precipitation as rain or snow, and collection in bodies of water.",
    "Photosynthesis is the process plants use to convert light energy into chemical energy. It involves capturing sunlight, absorbing carbon dioxide, and producing glucose and oxygen.",
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const generateMindmap = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    try {
      // Limit text to 10000 characters for guest endpoint
      const contentToSend = inputText.slice(0, 10000);
      if (inputText.length > 10000) {
        console.warn("Text truncated to 10000 characters for mindmap generation");
      }

      const res = await fetch(`${API_BASE_URL}/guest/generate-mindmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSend }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      if (data.nodes && data.edges) {
        // Convert API response to MindmapNode and MindmapEdge instances
        const mindmapNodes = data.nodes.map((nodeJson: Record<string, unknown>) =>
          MindmapNode.fromJSON(nodeJson)
        );
        const mindmapEdges = data.edges.map((edgeJson: Record<string, unknown>) =>
          MindmapEdge.fromJSON(edgeJson)
        );

        console.log(mindmapNodes);
        console.log(mindmapEdges);

        // Convert to ReactFlow format
        const nodes = mindmapNodes.map((node: MindmapNode) => ({
          id: node.id,
          type: "custom",
          data: {
            label: node.label,
            definition: node.definition,
            isHighlyImportant: node.isHighlyImportant,
          },
          position: { x: node.positionX, y: node.positionY },
        }));
        const edges = mindmapEdges.map((edge: MindmapEdge) => ({
          id: edge.id,
          type: "customedge",
          source: edge.source,
          target: edge.target,
        }));
        setMindmapNodes(nodes);
        setMindmapEdges(edges);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrySample = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(randomText);
  };

  const SkeletonLoader = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] animate-spin"></div>
        <Network className="w-6 h-6 text-[#8b5cf6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm text-muted-foreground">Generating your mindmap...</p>
    </div>
  );

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Visualize any concept instantly
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform complex topics into interactive visual maps with AI-powered concept mapping.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Top Bar */}
            {hasGenerated && (
              <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[12px] md:text-sm text-muted-foreground">{mindmapNodes.length} nodes</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Button variant="default" size="sm" className="text-[11px] md:text-sm">
                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Export
                  </Button>
                  <Button variant="default" size="sm" className="text-[11px] md:text-sm">
                    <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Flashcards
                  </Button>
                </div>
              </div>
            )}

            {/* Content Area */}
            {!hasGenerated ? (
              /* Input View */
              <div className="p-4 md:p-5 min-h-[300px] md:min-h-[400px] flex flex-col">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        setInputText(text);
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />

                {/* Top Section: Instruction + Buttons */}
                <div className="mb-3">
                  <p className="text-[12px] md:text-sm text-muted-foreground mb-2 md:mb-3">
                    To generate a mindmap, add text or upload a file (.docx)
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 rounded-full hover:bg-[#8b5cf6]/5 transition-colors"
                    >
                      <ClipboardIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Paste text
                    </button>
                    <button
                      onClick={() => setShowSignupModal(true)}
                      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 rounded-full hover:bg-[#8b5cf6]/5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload file
                    </button>
                    <button
                      onClick={handleTrySample}
                      className="px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try sample
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Start typing or paste your content here..."
                  className="flex-1 w-full min-h-[180px] md:min-h-[280px] bg-transparent text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none border-0 focus:border-0 focus:ring-0 text-[13px] md:text-base leading-relaxed"
                />

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                  <span className="text-[11px] md:text-sm text-muted-foreground">
                    {inputText.split(/\s+/).filter(Boolean).length}/25000 words
                  </span>
                  <Button
                    onClick={generateMindmap}
                    disabled={isLoading || !inputText.trim()}
                    variant={inputText.trim() ? "default" : "outline"}
                    className="text-[10px] md:text-sm px-2.5 md:px-4 py-1 md:py-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-2.5 h-2.5 md:w-4 md:h-4 mr-0.5 md:mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate mindmap"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Mindmap View */
              <div className="flex flex-col" style={{ height: "450px" }}>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 border-b border-border/50 bg-muted/10">
                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                    <Network className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Drag to move • Scroll to zoom</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => {
                        setHasGenerated(false);
                        setShowFullscreen(false);
                        setMindmapNodes([]);
                        setMindmapEdges([]);
                        setInputText("");
                      }}
                      className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <RefreshCw className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      New
                    </button>
                    <button
                      onClick={() => setShowFullscreen(true)}
                      className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Maximize2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Fullscreen
                    </button>
                  </div>
                </div>

                {/* Mindmap Canvas */}
                <div className="flex-1">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : (
                    <ReactFlowProvider>
                      <MindmapCanvas
                        initialNodes={mindmapNodes}
                        initialEdges={mindmapEdges}
                      />
                    </ReactFlowProvider>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />

      {/* Fullscreen Mindmap Modal */}
      {showFullscreen && hasGenerated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-[95vw] max-w-6xl h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full bg-background/90 border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-full h-full">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <ReactFlowProvider>
                  <MindmapCanvas
                    initialNodes={mindmapNodes}
                    initialEdges={mindmapEdges}
                  />
                </ReactFlowProvider>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Who Can Use Section */}
      <section className="py-18 px-6 lg:pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use AI Mindmaps?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Visualize complex subjects before exams — break down chapters into concept maps for faster comprehension and recall." },
              { icon: BookOpen, title: "Educators", desc: "Create visual teaching aids from lesson content to help students grasp relationships between key concepts." },
              { icon: FileText, title: "Researchers", desc: "Map out literature reviews, research frameworks, and theoretical connections across multiple papers." },
              { icon: PenLine, title: "Writers", desc: "Plan and organize article outlines, story plots, and content structures visually before writing." },
              { icon: Palette, title: "Project managers", desc: "Break down projects into visual task flows, dependencies, and milestones for better team alignment." },
              { icon: Lightbulb, title: "Lifelong learners", desc: "Turn any topic into an interactive visual map — perfect for self-study, courses, and exploring new subjects." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3.5">
                    <Icon className="w-4.5 h-4.5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-18 leading-tight">
            See the big picture, instantly
          </h2>

          {/* Feature 1 — Auto-generated */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 md:pt-10">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                <GitBranch className="w-4 h-4 text-[#8b5cf6]" />
                <span>AI-extracted concepts</span>
              </div>
              <div className="space-y-3">
                {["Main Concept", "Subtopic A", "Subtopic B", "Detail 1", "Detail 2"].map((node, i) => (
                  <div key={node} className="flex items-center gap-3 py-2 px-3 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#8b5cf6]" : "bg-muted-foreground/40"}`}></span>
                    <span className={`text-sm ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{node}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Auto-generated from<br />any text
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Paste any content and our AI instantly extracts key concepts, identifies relationships, and builds a visual map — no manual work required.
              </p>
            </div>
          </div>

          {/* Feature 2 — Interactive */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Fully interactive<br />and explorable
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Click nodes to expand details, drag to rearrange, scroll to zoom. Every mindmap is a living document you can explore and customize to your learning style.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                <MousePointer2 className="w-4 h-4 text-[#6366f1]" />
                <span>Drag to move &middot; Scroll to zoom</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="px-4 py-2 bg-[#6366f1] text-[#ffffff] text-sm rounded-lg">Main Topic</div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex gap-8">
                  <div className="px-3 py-1.5 bg-[#6366f1]/20 text-[#6366f1] text-xs rounded-md">Branch A</div>
                  <div className="px-3 py-1.5 bg-[#6366f1]/20 text-[#6366f1] text-xs rounded-md">Branch B</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 — Study smarter */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="space-y-3">
                {[
                  { label: "Textbook chapters", color: "bg-blue-500" },
                  { label: "Research papers", color: "bg-emerald-500" },
                  { label: "Lecture notes", color: "bg-amber-500" },
                  { label: "Articles & blogs", color: "bg-violet-500" },
                  { label: "Technical docs", color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2 px-3 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Boost retention with<br />visual learning
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Studies show visual learners retain 85% more information. Turn any content into an interactive map and master subjects faster than ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Create a mindmap in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Paste your text", desc: "Drop in any content — textbook chapters, research papers, lecture notes, or articles." },
              { step: "2", title: "Generate the map", desc: "Our AI extracts key concepts and builds an interactive visual map with connections automatically." },
              { step: "3", title: "Explore and study", desc: "Click nodes to expand, drag to rearrange, and export as flashcards or download your map." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 rounded-lg bg-[#6366f1] flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold" style={{ color: '#ffffff' }}>{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-[14px] text-muted-foreground leading-relaxed max-w-md">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-18 px-6 bg-background pt-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="bg-[#f4f3f8] text-muted-foreground border-0 mb-5 px-3.5 py-1.5 rounded-full font-normal text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mr-1.5 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-[40px] font-medium text-foreground">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-1">
            {[
              { q: "Is there a free plan?", a: "Yes! All users who sign up get access to 10 free credits daily, which can be used across all our tools including Mindmaps." },
              { q: "What kind of text can I map?", a: "Any text — textbook chapters, research papers, lecture notes, articles, technical documentation, and more. Our AI extracts the key concepts automatically." },
              { q: "Can I edit the generated mindmap?", a: "Absolutely. You can drag nodes to rearrange them, zoom in and out, and interact with every part of the visual map." },
              { q: "What are credits?", a: "Credits are the in-app currency for Conch that allows you to generate mindmaps, simplify text, create flashcards, and more. Each action costs 1 to 4 credits." },
              { q: "Can I export my mindmaps?", a: "Yes! You can export mindmaps as images or convert them directly into flashcards for study sessions." },
              { q: "How does visual learning help?", a: "Research shows that visual learning improves retention by up to 85%. Mindmaps help you see connections between concepts, making complex topics easier to understand and remember." },
              { q: "Can I convert mindmaps to flashcards?", a: "Yes! With one click you can turn any mindmap into a set of flashcards, making it easy to switch between visual learning and active recall practice." },
            ].map((faq, i) => (
              <div
                key={i}
                className={`px-5 py-4 cursor-pointer rounded-2xl transition-all ${
                  openFaq === i ? "bg-[#f4f3f8] dark:bg-secondary/40" : "hover:bg-[#f4f3f8]/30 dark:hover:bg-secondary/20"
                }`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] text-foreground">{faq.q}</p>
                  <ChevronDown className={`w-4.5 h-4.5 text-muted-foreground/50 transition-transform duration-200 flex-shrink-0 ml-3.5 ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && (
                  <p className="text-muted-foreground leading-relaxed mt-3.5 text-[13px]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-18 px-6 pt-10 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-[36px] font-medium text-foreground mb-2.5 leading-tight">
            Start mapping your knowledge
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Join students and professionals who learn visually with AI mindmaps.
          </p>
          <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => textareaRef.current?.focus()}>
            Create Free Mindmap
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
    </div>
  );
};

export default MindmapsFeature;
