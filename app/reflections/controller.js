function ReflectionsIndex(request, reply) {
  return reply('reflections index');
}

function ReflectionsShow(request, reply) {
  return reply(`reflections show ${request.params.id}`)
}
  
module.exports = {
  index: ReflectionsIndex,
  show: ReflectionsShow
};
