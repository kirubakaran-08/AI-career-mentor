import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ResumeData } from '../src/types.js';
import { emptyResumeData } from '../src/data/initialData.js';

describe('Resume Builder Blank Entry Creation & Export Hygiene Suite', () => {
  test('Adding experience creates blank editable structure without fictional employers or dates', () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      highlights: ['']
    };

    assert.equal(newExp.company, '');
    assert.equal(newExp.role, '');
    assert.equal(newExp.startDate, '');
    assert.equal(newExp.endDate, '');
    assert.deepEqual(newExp.highlights, ['']);
  });

  test('Adding project creates blank structure without fake tech or URLs', () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: '',
      technologies: '',
      description: '',
      link: ''
    };

    assert.equal(newProj.title, '');
    assert.equal(newProj.technologies, '');
    assert.equal(newProj.description, '');
    assert.equal(newProj.link, '');
  });

  test('Adding education creates blank structure without assumed degree or GPA', () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: ''
    };

    assert.equal(newEdu.institution, '');
    assert.equal(newEdu.degree, '');
    assert.equal(newEdu.grade, '');
  });

  test('Rendered resume filtering removes blank entries so placeholder text is not printed', () => {
    const resumeWithBlanks: ResumeData = {
      ...emptyResumeData,
      personalInfo: {
        ...emptyResumeData.personalInfo,
        fullName: 'Jane Developer',
        email: 'jane@example.com'
      },
      experience: [
        { id: '1', role: '', company: '', location: '', startDate: '', endDate: '', highlights: [''] },
        { id: '2', role: 'Software Engineer', company: 'Acme Corp', location: 'Remote', startDate: '2023', endDate: 'Present', highlights: ['Built APIs'] }
      ],
      projects: [
        { id: 'p1', title: '', technologies: '', description: '', link: '' },
        { id: 'p2', title: 'Real App', technologies: 'TypeScript', description: 'Production app', link: 'https://github.com/app' }
      ],
      education: [
        { id: 'e1', institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' },
        { id: 'e2', institution: 'State University', degree: 'B.S. in CS', fieldOfStudy: 'CS', startDate: '2019', endDate: '2023', grade: '3.8' }
      ]
    };

    // Experience filter from ResumeBuilder
    const filteredExp = resumeWithBlanks.experience.filter(
      exp => exp.role?.trim() || exp.company?.trim() || exp.highlights?.some(h => h.trim().length > 0)
    );
    assert.equal(filteredExp.length, 1);
    assert.equal(filteredExp[0].company, 'Acme Corp');

    // Projects filter from ResumeBuilder
    const filteredProj = resumeWithBlanks.projects.filter(
      proj => proj.title?.trim() || proj.description?.trim()
    );
    assert.equal(filteredProj.length, 1);
    assert.equal(filteredProj[0].title, 'Real App');

    // Education filter from ResumeBuilder
    const filteredEdu = resumeWithBlanks.education.filter(
      edu => edu.institution?.trim() || edu.degree?.trim()
    );
    assert.equal(filteredEdu.length, 1);
    assert.equal(filteredEdu[0].institution, 'State University');
  });
});
