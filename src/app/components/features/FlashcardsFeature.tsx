"use client";

import Footer from "@/app/components/ui/Footer";
import { CheckerFeature } from "./CheckerSidebar";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import ProgressBar from "@ramonak/react-progress-bar";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard as ClipboardIcon,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Grid,
  Layers,
  Lightbulb,
  List,
  MoreHorizontal,
  Palette,
  PenLine,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegStar, FaShapes, FaStar } from "react-icons/fa";
import { RiRestartLine, RiShuffleLine } from "react-icons/ri";
import SignupModal from "../SignupModal";
import { useAppContext } from "@/context/AppContext";
import { Session } from "@/context/SessionContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Flashcard {
  id: string;
  term: string;
  definition: string;
  favorited: boolean;
}

// Card animation variants (matching study component)
const cardVariants = {
  selected: {
    rotateY: 180,
    transition: { duration: 0.35 },
    zIndex: 10,
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
  notSelected: {
    rotateY: 0,
    transition: { duration: 0.35 },
  },
};

const textVariants = {
  termSelected: {
    opacity: 1,
    transition: {
      duration: 0.35,
      opacity: { delay: 0.25 },
    },
  },
  termNotSelected: {
    rotateY: 0,
    opacity: 0,
    display: "none",
    transition: { duration: 0.35 },
  },
  definitionSelected: {
    opacity: 1,
    rotateY: 180,
    transition: {
      duration: 0.35,
      opacity: { delay: 0.25 },
    },
  },
  definitionNotSelected: {
    rotateY: 0,
    opacity: 0,
    display: "none",
    transition: { duration: 0.35 },
  },
};

// Practice Flashcard Component (matching study component styling)
const PracticeFlashcard = ({
  flashcard,
  isActive,
  isFlipped,
  onFlip,
}: {
  flashcard: Flashcard;
  isActive: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full cursor-pointer"
    >
      <motion.div
        className="flex h-full w-full items-center justify-center"
        style={{
          borderRadius: "0.75rem",
          border: "1px solid var(--color-border)",
          background: "var(--color-secondary)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        variants={cardVariants}
        animate={isFlipped ? "selected" : "notSelected"}
        onClick={onFlip}
        initial={false}
      >
        <motion.p
          variants={textVariants}
          animate={!isFlipped ? "termSelected" : "termNotSelected"}
          className="px-8 text-center font-display text-2xl md:text-3xl font-light leading-relaxed text-foreground"
        >
          {flashcard.term}
        </motion.p>
        <motion.p
          variants={textVariants}
          initial={{ opacity: 0 }}
          animate={isFlipped ? "definitionSelected" : "definitionNotSelected"}
          className="px-8 text-center font-display text-xl md:text-2xl font-light leading-relaxed text-foreground"
        >
          {flashcard.definition}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Practice Icon Button (matching study component)
const PracticeIconButton = ({
  onClick,
  buttonText,
  Icon,
}: {
  onClick: () => void;
  buttonText: string;
  Icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors"
  >
    {Icon}
    <span className="text-[10px] text-muted-foreground">{buttonText}</span>
  </button>
);

interface FlashcardsFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
  session: Session; 
  handleLoggedIn: () => void;
}

const FlashcardsFeature = ({ onFeatureSelect, session, handleLoggedIn }: FlashcardsFeatureProps) => {
  const { checkLimit, incrementUsage } = useAppContext();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<"practice" | "list" | "gallery">("practice");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const sampleTexts = [
    "The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration. The cell membrane is a selective barrier that controls what enters and exits the cell. DNA contains genetic instructions for all living organisms.",
    "Newton's First Law states that an object at rest stays at rest. Newton's Second Law defines force as mass times acceleration. Newton's Third Law explains that every action has an equal and opposite reaction.",
    "Photosynthesis converts light energy to chemical energy. Chlorophyll absorbs light primarily in the blue and red wavelengths. The Calvin cycle produces glucose from carbon dioxide.",
  ];

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;

    if (session?.isLoggedIn) {
      handleLoggedIn();
      return;
    }

    if (!checkLimit("flashcards")) {
      setShowSignupModal(true);
      return;
    }

    setIsLoading(true);
    setFlashcards([]);

    try {
      // Limit text to 10000 characters for guest endpoint
      const contentToSend = inputText.slice(0, 10000);
      if (inputText.length > 10000) {
        console.warn("Text truncated to 10000 characters for flashcard generation");
      }

      const res = await fetch(`${API_BASE_URL}/guest/generate-flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: contentToSend,
          count: 15 // default count for guests (5-20 range)
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      if (data.flashcards && Array.isArray(data.flashcards)) {
        // Add favorited field to each flashcard (defaults to false)
        const flashcardsWithFavorites = data.flashcards.map((card: { id: string; term: string; definition: string }) => ({
          id: card.id,
          term: card.term,
          definition: card.definition,
          favorited: false,
        }));
        setFlashcards(flashcardsWithFavorites);
        setHasGenerated(true);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        incrementUsage("flashcards");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      generateSampleFlashcards();
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleFlashcards = () => {
    const sampleCards: Flashcard[] = [
      { id: "1", term: "Mitochondria", definition: "The powerhouse of the cell, responsible for producing ATP through cellular respiration", favorited: true },
      { id: "2", term: "Cell Membrane", definition: "A selective barrier that controls what enters and exits the cell, made of a phospholipid bilayer", favorited: false },
      { id: "3", term: "DNA", definition: "Deoxyribonucleic acid - contains genetic instructions for all living organisms", favorited: false },
      { id: "4", term: "Ribosome", definition: "Cellular organelle that synthesizes proteins by translating messenger RNA", favorited: true },
      { id: "5", term: "Nucleus", definition: "The control center of the cell, containing genetic material and directing cell activities", favorited: false },
    ];
    setFlashcards(sampleCards);
    setHasGenerated(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleTrySample = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(randomText);
  };

  const goToPreviousCard = useCallback(() => {
    if (currentCardIndex === 0) {
      setCurrentCardIndex(flashcards.length - 1);
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
    }
    setIsFlipped(false);
  }, [currentCardIndex, flashcards.length]);

  const goToNextCard = useCallback(() => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
  }, [currentCardIndex, flashcards.length]);

  // Handle keyboard navigation (matching study component)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasGenerated || flashcards.length === 0) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.keyCode === 37 || e.keyCode === 38) {
        goToPreviousCard();
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        goToNextCard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasGenerated, flashcards.length, goToNextCard, goToPreviousCard]);

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const toggleFavorite = (id: string) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, favorited: !card.favorited } : card
    ));
  };

  const deleteCard = (id: string) => {
    const newCards = flashcards.filter(card => card.id !== id);
    setFlashcards(newCards);
    if (currentCardIndex >= newCards.length && newCards.length > 0) {
      setCurrentCardIndex(newCards.length - 1);
    }
  };

  const addNewCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      term: "",
      definition: "",
      favorited: false,
    };
    setFlashcards([...flashcards, newCard]);
    setEditingCard(newCard.id);
    setViewMode("list");
  };

  const updateCard = (id: string, field: "term" | "definition", value: string) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const SkeletonLoader = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#6366f1]/20 border-t-primary animate-spin"></div>
        <Layers className="w-6 h-6 text-[#6366f1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm text-muted-foreground">Generating your flashcards...</p>
    </div>
  );

  // Placeholder Card Component (matching study component)
  const PlaceholderCard = ({ left = false, onClick }: { left?: boolean; onClick: () => void }) => (
    <div
      className={`${left ? "" : "rotate-180"} relative cursor-pointer overflow-hidden rounded-xl opacity-40 hidden md:flex items-center justify-center`}
      style={{
        background: "linear-gradient(to left, var(--color-secondary) -10%, var(--color-background) 40%)",
        border: "1px solid var(--color-border)",
        borderLeft: left ? "1px solid var(--color-border)" : "none",
        borderRight: left ? "none" : "1px solid var(--color-border)",
        width: "80px",
        height: "200px",
      }}
      onClick={onClick}
    >
      {left ? (
        <ChevronLeft className="w-5 h-5 text-foreground" />
      ) : (
        <ChevronRight className="w-5 h-5 text-foreground rotate-180" />
      )}
    </div>
  );

  // Practice View (matching study component styling)
  const renderPracticeView = () => {
    if (flashcards.length === 0) return null;
    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8">
        {/* Progress (matching study component) */}
        <div className="w-full max-w-lg mb-6">
          <p className="text-left text-sm font-light text-muted-foreground mb-2">
            {currentCardIndex + 1} / {flashcards.length}
          </p>
          <ProgressBar
            completed={Math.max((currentCardIndex / flashcards.length) * 100, 1)}
            customLabel=" "
            baseBgColor="var(--color-border)"
            bgColor="#A799FB"
            height="0.25rem"
            className="w-full"
          />
        </div>

        {/* Flashcard with side placeholders */}
        <div className="flex w-full justify-center items-center gap-6 mb-6">
          <PlaceholderCard left onClick={goToPreviousCard} />

          <div className="w-full max-w-2xl h-[400px]">
            <PracticeFlashcard
              flashcard={currentCard}
              isActive={true}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>

          <PlaceholderCard onClick={goToNextCard} />
        </div>

        {/* Controls (matching study component) */}
        <div className="flex items-center justify-center gap-1">
          <PracticeIconButton
            onClick={() => toggleFavorite(currentCard.id)}
            buttonText="Star"
            Icon={
              currentCard.favorited ? (
                <FaStar className="w-4 h-4" color="#E5B53A" />
              ) : (
                <FaRegStar className="w-4 h-4 text-muted-foreground" />
              )
            }
          />
          <PracticeIconButton
            onClick={shuffleCards}
            buttonText="Shuffle"
            Icon={<RiShuffleLine className="w-4 h-4 text-muted-foreground" />}
          />
          <PracticeIconButton
            onClick={resetCards}
            buttonText="Restart"
            Icon={<RiRestartLine className="w-4 h-4 text-muted-foreground" />}
          />
          <PracticeIconButton
            onClick={() => setViewMode("gallery")}
            buttonText="All"
            Icon={<FaShapes className="w-4 h-4 text-muted-foreground" />}
          />
        </div>

        {/* Keyboard hint */}
        <p className="mt-4 text-sm text-muted-foreground">
          Press <kbd className="px-2 py-0.5 rounded bg-secondary text-xs">Space</kbd> to flip • <kbd className="px-2 py-0.5 rounded bg-secondary text-xs">←</kbd> <kbd className="px-2 py-0.5 rounded bg-secondary text-xs">→</kbd> to navigate
        </p>
      </div>
    );
  };

  const renderListView = () => (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {flashcards.map((card, index) => (
          <div
            key={card.id}
            className="rounded-xl p-5"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-secondary)",
            }}
          >
            <div className="flex items-start gap-4">
              <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-lg shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                {editingCard === card.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={card.term}
                      onChange={(e) => updateCard(card.id, "term", e.target.value)}
                      placeholder="Term"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#6366f1]"
                      autoFocus
                    />
                    <textarea
                      value={card.definition}
                      onChange={(e) => updateCard(card.id, "definition", e.target.value)}
                      placeholder="Definition"
                      rows={3}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#6366f1] resize-none"
                    />
                    <button
                      onClick={() => setEditingCard(null)}
                      className="text-sm text-[#6366f1] hover:underline font-medium"
                    >
                      Done editing
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-lg text-foreground">{card.term || "Untitled"}</h4>
                    <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                      {card.definition || "No definition"}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFavorite(card.id)}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  {card.favorited ? (
                    <FaStar className="w-5 h-5" color="#E5B53A" />
                  ) : (
                    <FaRegStar className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setEditingCard(editingCard === card.id ? null : card.id)}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card button (matching study component) */}
        <div
          className="w-full max-w-md mx-auto cursor-pointer flex items-center justify-center py-5 rounded-xl"
          style={{
            border: "1px dashed var(--color-border)",
            background: "var(--color-secondary)",
          }}
          onClick={addNewCard}
        >
          <Plus className="mr-2 w-5 h-5 text-foreground" />
          <p className="text-foreground text-base font-light">Add card</p>
        </div>

        {/* Spacer */}
        <div className="h-8"></div>
      </div>
    </div>
  );

  // Gallery Flashcard Component (matching study component)
  const GalleryFlashcard = ({ card }: { card: Flashcard }) => {
    const [clicked, setClicked] = useState(false);
    const [showFavorite, setShowFavorite] = useState(false);

    return (
      <div
        className="relative h-[220px] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] cursor-pointer"
        onMouseEnter={() => setShowFavorite(true)}
        onMouseLeave={() => setShowFavorite(false)}
      >
        <motion.div
          className="flex h-full w-full items-center justify-center rounded-xl"
          style={{
            background: "var(--color-secondary)",
            border: "1px solid var(--color-border)",
          }}
          variants={cardVariants}
          animate={clicked ? "selected" : "notSelected"}
          onClick={() => setClicked(!clicked)}
          initial={false}
        >
          <motion.p
            variants={textVariants}
            animate={!clicked ? "termSelected" : "termNotSelected"}
            className="px-6 text-center text-lg font-light leading-relaxed text-foreground"
          >
            {card.term}
          </motion.p>
          <motion.p
            variants={textVariants}
            initial={{ opacity: 0 }}
            animate={clicked ? "definitionSelected" : "definitionNotSelected"}
            className="px-6 text-center text-base font-light leading-relaxed text-foreground"
          >
            {card.definition}
          </motion.p>
        </motion.div>
        {(showFavorite || card.favorited) && (
          <motion.button
            className="absolute top-3 right-3 z-10"
            animate={clicked ? { rotateY: 180 } : { rotateY: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(card.id);
            }}
          >
            {card.favorited ? (
              <FaStar className="w-4 h-4" color="#E5B53A" />
            ) : (
              <FaRegStar className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.button>
        )}
      </div>
    );
  };

  // Empty Card Component (matching study component)
  const EmptyCard = () => (
    <div
      className="h-[220px] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] cursor-pointer flex items-center justify-center rounded-xl"
      style={{
        background: "var(--color-secondary)",
        border: "1px solid var(--color-border)",
      }}
      onClick={() => setIsExpanded(true)}
    >
      <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
    </div>
  );

  const renderGalleryView = () => (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-wrap gap-4">
        {flashcards.map((card, index) => {
          if (!isExpanded && index >= 5) return null;
          return <GalleryFlashcard key={card.id} card={card} />;
        })}
        {!isExpanded && flashcards.length > 5 && <EmptyCard />}
      </div>
      {flashcards.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>click card to flip</span>
          <span>{flashcards.length} terms</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-full bg-background text-foreground overflow-hidden flex flex-col px-4 md:px-6">
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

      {!hasGenerated ? (
        /* Input View - Clean QuillBot Style */
        <>
          {/* Hero Section */}
          <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
                Study smarter with AI flashcards
              </h1>
              <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Automatically generate flashcards from any text. Practice, review, and master any subject.
              </p>
            </div>
          </section>

  {/* Signup Modal */}
  <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        content="You've reached your free limit. Sign up for Conch to continue generating flashcards."
      />
          <section className="px-4 md:px-8 pb-10 md:pb-14 flex-1">
            <div className="max-w-5xl mx-auto">
              <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-lg overflow-hidden">
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
                      To generate flashcards, add text or upload a file (.docx)
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
                        onClick={() => {
                          if (session?.isLoggedIn) {
                            handleLoggedIn();
                          } else {
                            setShowSignupModal(true);
                          }
                        }}
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
                      onClick={generateFlashcards}
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
                        "Generate flashcards"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Flashcards View - Full Width */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card shrink-0 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 md:gap-3.5 flex-wrap">
              <span className="text-base md:text-lg font-semibold text-foreground">Flashcards</span>
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("practice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewMode === "practice" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  Practice
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-3 h-3" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewMode === "gallery" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  Gallery
                </button>
              </div>
              <span className="text-[12px] md:text-sm text-muted-foreground">{flashcards.length} cards</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button variant="default" size="sm" className="text-[11px] md:text-sm">
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Export
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-[11px] md:text-sm"
                onClick={() => {
                  setHasGenerated(false);
                  setFlashcards([]);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
              >
                <RefreshCw className="w-4 h-4" />
                New
              </Button>
            </div>
          </div>

          {/* View Content - Full Height */}
          <div className="flex-1 overflow-hidden bg-background">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <SkeletonLoader />
              </div>
            ) : (
              viewMode === "practice" ? renderPracticeView() :
              viewMode === "list" ? renderListView() :
              renderGalleryView()
            )}
          </div>
        </div>
      )}

      {/* Who Can Use Section */}
      <section className="py-18 px-6 lg:pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use AI Flashcards?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Generate flashcards from textbooks, lecture notes, and study guides to ace exams with active recall." },
              { icon: BookOpen, title: "Educators", desc: "Create study sets for students from any course material — automatically extract key terms and definitions." },
              { icon: FileText, title: "Medical students", desc: "Turn dense medical terminology, anatomy notes, and clinical concepts into bite-sized study cards." },
              { icon: PenLine, title: "Language learners", desc: "Build vocabulary decks from articles, texts, and lessons in any language with AI-generated translations." },
              { icon: Palette, title: "Test preppers", desc: "Prepare for SAT, GRE, MCAT, and other standardized tests with AI-generated practice cards from prep material." },
              { icon: Lightbulb, title: "Professionals", desc: "Master new certifications, industry terms, and technical concepts with flashcards generated from training materials." },
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
            Master any subject, faster
          </h2>

          {/* Feature 1 — Auto-generated */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 md:pt-10">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                <Zap className="w-4 h-4 text-[#6366f1]" />
                <span>AI-extracted terms</span>
              </div>
              <div className="space-y-3">
                {["Mitochondria", "Cell Membrane", "DNA", "Ribosome", "Nucleus"].map((term, i) => (
                  <div key={term} className="flex items-center justify-between py-2 px-3 rounded-lg">
                    <span className="text-sm text-foreground">{term}</span>
                    <span className="text-xs text-muted-foreground">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Auto-generated from<br />any text
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Paste any content and our AI instantly extracts key terms and definitions — no manual card creation needed. Works with textbooks, notes, articles, and more.
              </p>
            </div>
          </div>

          {/* Feature 2 — Practice mode */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                3 study modes for<br />every learner
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Practice with flip cards for active recall, browse the list view for quick review, or use gallery view to see everything at once. Star, shuffle, and track your progress.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex gap-2 mb-6">
                {["Practice", "List", "Gallery"].map((m, i) => (
                  <span key={m} className={`px-3 py-1.5 rounded-full text-sm font-medium ${i === 0 ? "bg-[#6366f1] text-[#ffffff]" : "bg-muted text-muted-foreground"}`}>
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed italic">
                &ldquo;Press Space to flip &middot; Arrow keys to navigate&rdquo;
              </p>
            </div>
          </div>

          {/* Feature 3 — Fully editable */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="space-y-3">
                {[
                  { action: "Edit any card", icon: "pencil" },
                  { action: "Add new cards", icon: "plus" },
                  { action: "Delete cards", icon: "trash" },
                  { action: "Star favorites", icon: "star" },
                  { action: "Export your set", icon: "download" },
                ].map((item) => (
                  <div key={item.action} className="flex items-center gap-3 py-2 px-3 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
                    <span className="text-sm text-foreground">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Fully editable and<br />customizable
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Every card is yours to edit. Add new cards, delete ones you know, star important terms, and export your entire set. Your study deck, your rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Create flashcards in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Paste your text", desc: "Drop in any study material — textbook chapters, lecture notes, articles, or research papers." },
              { step: "2", title: "Generate cards", desc: "Our AI extracts key terms and definitions, creating a complete flashcard set in seconds." },
              { step: "3", title: "Study and master", desc: "Practice with flip cards, track progress, shuffle, star favorites, and export your deck." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 rounded-lg bg-[#6366f1] flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-[#ffffff]">{item.step}</span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mr-1.5 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-[40px] font-medium text-foreground">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-1">
            {[
              { q: "Is there a free plan?", a: "Yes! All users who sign up get access to 10 free credits daily, which can be used across all our tools including Flashcards." },
              { q: "What kind of text can I generate flashcards from?", a: "Any text — textbook chapters, lecture notes, research papers, articles, technical documentation, and more. Our AI extracts key terms and definitions automatically." },
              { q: "Can I edit the generated flashcards?", a: "Absolutely. You can edit terms and definitions, add new cards, delete ones you know, and star important cards for focused review." },
              { q: "What are the study modes?", a: "We offer 3 study modes: Practice (flip cards with keyboard shortcuts), List (scrollable card list with editing), and Gallery (grid view with flip animation)." },
              { q: "What are credits?", a: "Credits are the in-app currency for Conch that allows you to generate flashcards, simplify text, create mindmaps, and more. Each action costs 1 to 4 credits." },
              { q: "Can I export my flashcards?", a: "Yes! You can export your flashcard set for sharing with classmates or for use in other study tools." },
              { q: "Does it support keyboard shortcuts?", a: "Yes! Press Space to flip a card, use arrow keys to navigate between cards. It's designed for fast, efficient studying." },
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
            Start studying smarter today
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Join millions of students who ace their exams with AI flashcards.
          </p>
          <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => textareaRef.current?.focus()}>
            Create Free Flashcards
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
    </div>
  );
};

export default FlashcardsFeature;
