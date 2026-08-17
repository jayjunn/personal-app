'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Work from './Work';
import { workData as defaultWorkData } from '../data/portfolioData';
import { Project } from '../service/portfolioService';
import { useLanguage } from '@/hooks/useLanguage';
import PageWrap from './common/PageWrap';
import TechStackFilter from './common/TechStackFilter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface WorkListProps {
  limit?: number;
  showMoreLink?: boolean;
  useSlider?: boolean;
  initialWorks?: Project[];
}

const WorkList = ({
  limit,
  showMoreLink = false,
  useSlider = false,
  initialWorks,
}: WorkListProps) => {
  const { isEnglish } = useLanguage();
  const [selectedStack, setSelectedStack] = useState<string>('ALL');

  const works = initialWorks || defaultWorkData;

  // Extract unique tech stacks and compute counts
  const { allStacks, stackCounts } = useMemo(() => {
    const counts: Record<string, number> = { ALL: works.length };
    const stackSet = new Set<string>();

    works.forEach((w) => {
      w.stacks.forEach((s) => {
        const formatted = s.trim();
        if (formatted) {
          stackSet.add(formatted);
          counts[formatted] = (counts[formatted] || 0) + 1;
        }
      });
    });

    return {
      allStacks: ['ALL', ...Array.from(stackSet)],
      stackCounts: counts,
    };
  }, [works]);

  // Filter works by selected stack
  const filteredWorks = useMemo(() => {
    if (selectedStack === 'ALL') {
      return limit ? works.slice(0, limit) : works;
    }
    const filtered = works.filter((w) =>
      w.stacks.some((s) => s.toLowerCase() === selectedStack.toLowerCase())
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }, [works, selectedStack, limit]);

  return (
    <PageWrap
      title="Works"
      moreLink={showMoreLink ? '/works' : undefined}
      moreText={isEnglish ? 'VIEW ALL WORKS ➔' : '전체 프로젝트 보기 ➔'}
    >
      <div className="w-full flex flex-col gap-5">
        {/* Interactive Tech Stack Filter Bar */}
        <div className="w-full">
          <TechStackFilter
            stacks={allStacks}
            selectedStack={selectedStack}
            onSelectStack={setSelectedStack}
            counts={stackCounts}
          />
        </div>

        {/* Works Display */}
        {useSlider && selectedStack === 'ALL' ? (
          <div className="w-full relative pb-4 [&_.swiper]:!pb-12 [&_.swiper-pagination-bullet]:!bg-black dark:[&_.swiper-pagination-bullet]:!bg-[#e7e2d0] [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet-active]:!rounded-sm [&_.swiper-button-next]:!text-black dark:[&_.swiper-button-next]:!text-[#e7e2d0] [&_.swiper-button-prev]:!text-black dark:[&_.swiper-button-prev]:!text-[#e7e2d0] [&_.swiper-button-next]:after:!text-lg [&_.swiper-button-prev]:after:!text-lg">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="w-full"
            >
              {filteredWorks.map((item, index) => (
                <SwiperSlide className="!h-auto flex" key={`work-slide-${item.id ?? 'idx'}-${item.name}-${index}`}>
                  <Work
                    name={item.name}
                    img={item.img}
                    description={isEnglish ? item.description.en : item.description.kr}
                    stacks={item.stacks}
                    link={item.link}
                    company={item.company}
                    priority={index < 2}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <motion.div
            layout
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((item, index) => (
                <motion.div
                  key={`work-card-${item.id ?? 'idx'}-${item.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex"
                >
                  <Work
                    name={item.name}
                    img={item.img}
                    description={isEnglish ? item.description.en : item.description.kr}
                    stacks={item.stacks}
                    link={item.link}
                    company={item.company}
                    priority={index < 2}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredWorks.length === 0 && (
          <div className="w-full py-12 text-center border-2 border-dashed border-black dark:border-[#e7e2d0] p-6">
            <p className="font-mono font-bold text-sm text-neutral-600 dark:text-neutral-400">
              {isEnglish
                ? `No projects found matching "${selectedStack}".`
                : `"${selectedStack}" 스택에 해당하는 프로젝트가 없습니다.`}
            </p>
          </div>
        )}
      </div>
    </PageWrap>
  );
};

export default WorkList;
