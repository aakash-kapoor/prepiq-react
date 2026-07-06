import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { TimelineDay, JobApp } from '../pages/StudyPlan';

interface StudyPlanPDFExportProps {
  timeline: TimelineDay[];
  selectedApp: JobApp;
  daysRemaining: number;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingRight: 40,
    paddingBottom: 60,
    paddingLeft: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155', // slate-700
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0', // slate-200
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A', // slate-900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#4F46E5', // indigo-600
    marginBottom: 10,
  },
  metaText: {
    fontSize: 9,
    color: '#64748B', // slate-500
    marginTop: 2,
  },
  timelineList: {
    flexDirection: 'column',
  },
  dayRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  leftTimeline: {
    width: 20,
    alignItems: 'center',
    position: 'relative',
  },
  timelineLineTop: {
    width: 1.5,
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    left: 9.25,
    top: 0,
    height: 9,
  },
  timelineLineBottom: {
    width: 1.5,
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    left: 9.25,
    top: 9,
    bottom: 0,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2.5,
    position: 'absolute',
    left: 5,
    top: 4,
  },
  rightContent: {
    flex: 1,
    paddingLeft: 12,
  },
  card: {
    backgroundColor: '#F8FAFC', // slate-50
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dayTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  description: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  focusTopicsText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    marginTop: 4,
  },
  focusTopicsLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
  topicText: {
    fontFamily: 'Helvetica-Bold',
    color: '#475569', // slate-600
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#94A3B8', // slate-400
  },
  pageNumber: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#94A3B8', // slate-400
  },
});

const StudyPlanPDFExport = ({ timeline, selectedApp, daysRemaining }: StudyPlanPDFExportProps) => {
  const formattedDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Interview Study Plan</Text>
          <Text style={styles.subtitle}>
            {selectedApp.company} — {selectedApp.role}
          </Text>
          {selectedApp.interviewDate && (
            <Text style={styles.metaText}>
              Interview Date: {new Date(selectedApp.interviewDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          )}
          <Text style={styles.metaText}>
            Timeline: {selectedApp.studyPlanDays || daysRemaining} Days
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineList}>
          {timeline.map((day, idx) => {
            let dotColor = '#6366F1'; // indigo-500
            let dotBorder = '#EEF2F6';
            if (day.type === 'mock') {
              dotColor = '#F59E0B'; // amber-500
              dotBorder = '#FEF3C7';
            }
            if (day.type === 'final') {
              dotColor = '#EF4444'; // red-500
              dotBorder = '#FEE2E2';
            }

            const isFirst = idx === 0;
            const isLast = idx === timeline.length - 1;

            return (
              <View key={day.dayNumber} style={styles.dayRow} wrap={false}>
                {/* Left Timeline Rail */}
                <View style={styles.leftTimeline}>
                  {!isFirst && <View style={styles.timelineLineTop} />}
                  {!isLast && <View style={styles.timelineLineBottom} />}
                  <View style={[styles.timelineDot, { backgroundColor: dotColor, borderColor: dotBorder }]} />
                </View>

                {/* Right Timeline Card */}
                <View style={styles.rightContent}>
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.dayLabel}>Day {day.dayNumber}</Text>
                      <Text style={styles.dayTitle}>{day.title}</Text>
                    </View>

                    <Text style={styles.description}>{day.description}</Text>

                    {day.focusTopics && day.focusTopics.length > 0 && (
                      <Text style={styles.focusTopicsText}>
                        <Text style={styles.focusTopicsLabel}>FOCUS TOPICS:  </Text>
                        <Text style={styles.topicText}>
                          {day.focusTopics.join('  •  ')}
                        </Text>
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Generated by PrepIQ • Exported on {formattedDate}
            </Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
              `Page ${pageNumber} of ${totalPages}`
            )} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default StudyPlanPDFExport;